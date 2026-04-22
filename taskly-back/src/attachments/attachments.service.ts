import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttachmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, projectId: string, taskId: string): Promise<any[]> {
    await this.validateMember(projectId, userId);

    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.projectId !== projectId) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.attachment.findMany({
      where: { taskId },
      include: {
        uploadedBy: {
          select: { id: true, name: true, color: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(
    userId: string,
    projectId: string,
    taskId: string,
    dto: { name: string; url: string; size: number; mimeType?: string; extension?: string }
  ): Promise<any> {
    await this.validateMember(projectId, userId);

    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.projectId !== projectId) {
      throw new NotFoundException('Task not found');
    }

    const member = await this.prisma.projectMember.findFirst({
      where: { projectId, userId },
    });

    if (!member) {
      throw new ForbiddenException('Not a project member');
    }

    return this.prisma.attachment.create({
      data: {
        name: dto.name,
        url: dto.url,
        size: dto.size,
        mimeType: dto.mimeType,
        extension: dto.extension,
        taskId,
        uploadedById: member.id,
        projectId,
      },
      include: {
        uploadedBy: {
          select: { id: true, name: true, color: true },
        },
      },
    });
  }

  async delete(userId: string, projectId: string, taskId: string, attachmentId: string): Promise<void> {
    const project = await this.getProjectWithMember(projectId, userId);
    this.validateCanEdit(project, userId);

    const attachment = await this.prisma.attachment.findUnique({
      where: { id: attachmentId },
    });

    if (!attachment || attachment.taskId !== taskId || attachment.projectId !== projectId) {
      throw new NotFoundException('Attachment not found');
    }

    await this.prisma.attachment.delete({ where: { id: attachmentId } });
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
      throw new ForbiddenException('Only admins can manage attachments');
    }
  }
}