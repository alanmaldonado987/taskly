import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Project, ProjectMember, Task } from '@prisma/client';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateProjectDto): Promise<Project> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    return this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        settings: {
          create: {},
        },
        members: {
          create: {
            name: user!.name,
            email: user!.email,
            color: this.generateColor(),
            role: 'OWNER',
            userId: userId,
          },
        },
      },
      include: {
        settings: true,
        members: true,
      },
    });
  }

  async findAll(userId: string): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        settings: true,
        members: true,
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(userId: string, projectId: string): Promise<Project & { members: ProjectMember[]; tasks: Task[] }> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        settings: true,
        members: true,
        tasks: {
          include: {
            assignees: true,
            dependents: true,
          },
        },
      },
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

  async update(
    userId: string,
    projectId: string,
    dto: Partial<CreateProjectDto>
  ): Promise<Project & { settings: any; members: ProjectMember[] }> {
    const project = await this.findOne(userId, projectId);

    const isAdminOrOwner = project.members.some(
      (m) => m.userId === userId && (m.role === 'OWNER' || m.role === 'ADMIN')
    );

    if (!isAdminOrOwner) {
      throw new ForbiddenException('Only admins can update project');
    }

    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        name: dto.name,
        description: dto.description,
      },
      include: {
        settings: true,
        members: true,
      },
    });
  }

  async delete(userId: string, projectId: string): Promise<void> {
    const project = await this.findOne(userId, projectId);

    const isOwner = project.members.some(
      (m) => m.userId === userId && m.role === 'OWNER'
    );

    if (!isOwner) {
      throw new ForbiddenException('Only the owner can delete project');
    }

    await this.prisma.project.delete({ where: { id: projectId } });
  }

  private generateColor(): string {
    const colors = [
      '#ef4444', '#f97316', '#eab308', '#22c55e',
      '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}