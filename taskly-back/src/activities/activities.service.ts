import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, projectId: string, taskId?: string, limit = 50): Promise<any[]> {
    await this.validateMember(projectId, userId);

    const where: any = { projectId };
    if (taskId) {
      where.taskId = taskId;
    }

    return this.prisma.activity.findMany({
      where,
      include: {
        performedBy: {
          select: { id: true, name: true, color: true },
        },
        task: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async log(
    projectId: string,
    taskId: string | null,
    performedById: string,
    type: string,
    description: string,
    previous?: Record<string, any> | null,
    current?: Record<string, any> | null
): Promise<void> {
  await this.prisma.activity.create({
    data: {
      projectId,
      taskId,
      performedById,
      type: type as any,
      description,
      previous: previous ?? Prisma.JsonNull,
      current: current ?? Prisma.JsonNull,
    },
  });
}

  async logTaskCreated(projectId: string, taskId: string, performedById: string, taskName: string): Promise<void> {
    await this.log(projectId, taskId, performedById, 'TASK_CREATED', `Tarea "${taskName}" creada`, null, { name: taskName });
  }

  async logTaskUpdated(projectId: string, taskId: string, performedById: string, taskName: string, changes: string): Promise<void> {
    await this.log(projectId, taskId, performedById, 'TASK_UPDATED', `${changes} en "${taskName}"`, null, { changes });
  }

  async logTaskDeleted(projectId: string, taskId: string, performedById: string, taskName: string): Promise<void> {
    await this.log(projectId, taskId, performedById, 'TASK_DELETED', `Tarea "${taskName}" eliminada`);
  }

  async logStatusChanged(projectId: string, taskId: string, performedById: string, taskName: string, oldStatus: string, newStatus: string): Promise<void> {
    await this.log(projectId, taskId, performedById, 'STATUS_CHANGED', `"${taskName}" cambió de ${oldStatus} a ${newStatus}`, { status: oldStatus }, { status: newStatus });
  }

  async logCommentAdded(projectId: string, taskId: string, performedById: string, authorName: string): Promise<void> {
    await this.log(projectId, taskId, performedById, 'COMMENT_ADDED', `${authorName} agregó un comentario`);
  }

  async logMemberAdded(projectId: string, performerId: string, newMemberName: string): Promise<void> {
    await this.log(projectId, null, performerId, 'MEMBER_ADDED', `${newMemberName} se unió al proyecto`);
  }

  async logMemberRemoved(projectId: string, performerId: string, removedMemberName: string): Promise<void> {
    await this.log(projectId, null, performerId, 'MEMBER_REMOVED', `${removedMemberName} fue removido del proyecto`);
  }

  async logTaskAssigned(projectId: string, taskId: string, performedById: string, taskName: string, assigneeName: string): Promise<void> {
    await this.log(projectId, taskId, performedById, 'TASK_UPDATED', `"${assigneeName}" asignado a "${taskName}"`);
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
}