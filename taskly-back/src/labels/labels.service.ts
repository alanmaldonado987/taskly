import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLabelDto, UpdateLabelDto } from './dto';

@Injectable()
export class LabelsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, projectId: string, dto: CreateLabelDto): Promise<any> {
    const project = await this.getProjectWithMember(projectId, userId);
    this.validateCanEdit(project, userId);

    return this.prisma.label.create({
      data: {
        name: dto.name,
        color: dto.color || '#6366f1',
        projectId,
      },
    });
  }

  async findAll(userId: string, projectId: string): Promise<any[]> {
    await this.validateMember(projectId, userId);

    return this.prisma.label.findMany({
      where: { projectId },
      include: {
        tasks: {
          include: { task: true },
        },
      },
    });
  }

  async findOne(userId: string, projectId: string, labelId: string): Promise<any> {
    await this.validateMember(projectId, userId);

    const label = await this.prisma.label.findUnique({
      where: { id: labelId },
      include: {
        tasks: {
          include: { task: true },
        },
      },
    });

    if (!label || label.projectId !== projectId) {
      throw new NotFoundException('Label not found');
    }

    return label;
  }

  async update(
    userId: string,
    projectId: string,
    labelId: string,
    dto: UpdateLabelDto
  ): Promise<any> {
    const project = await this.getProjectWithMember(projectId, userId);
    this.validateCanEdit(project, userId);

    const label = await this.prisma.label.findUnique({ where: { id: labelId } });
    if (!label || label.projectId !== projectId) {
      throw new NotFoundException('Label not found');
    }

    return this.prisma.label.update({
      where: { id: labelId },
      data: {
        name: dto.name,
        color: dto.color,
      },
    });
  }

  async delete(userId: string, projectId: string, labelId: string): Promise<void> {
    const project = await this.getProjectWithMember(projectId, userId);
    this.validateCanEdit(project, userId);

    const label = await this.prisma.label.findUnique({ where: { id: labelId } });
    if (!label || label.projectId !== projectId) {
      throw new NotFoundException('Label not found');
    }

    await this.prisma.label.delete({ where: { id: labelId } });
  }

  async addToTask(userId: string, projectId: string, labelId: string, taskId: string): Promise<any> {
    await this.validateMember(projectId, userId);

    const label = await this.prisma.label.findUnique({ where: { id: labelId } });
    if (!label || label.projectId !== projectId) {
      throw new NotFoundException('Label not found');
    }

    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.projectId !== projectId) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.taskLabel.upsert({
      where: { taskId_labelId: { taskId, labelId } },
      create: { taskId, labelId },
      update: { taskId, labelId },
    });
  }

  async removeFromTask(userId: string, projectId: string, labelId: string, taskId: string): Promise<any> {
    await this.validateMember(projectId, userId);

    await this.prisma.taskLabel.deleteMany({
      where: { taskId, labelId },
    });

    return { success: true };
  }

  private async getProjectWithMember(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { members: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const isMember = project.members.some((m) => m.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('Access denied');
    }

    return project;
  }

  private async validateMember(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { members: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const isMember = project.members.some((m) => m.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('Access denied');
    }
  }

  private validateCanEdit(project: any, userId: string) {
    const member = project.members.find((m: any) => m.userId === userId);
    if (!member || (member.role !== 'OWNER' && member.role !== 'ADMIN')) {
      throw new ForbiddenException('Only admins can manage labels');
    }
  }
}