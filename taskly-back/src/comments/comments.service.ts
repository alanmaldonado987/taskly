import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import type { Comment } from '../types';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    projectId: string,
    taskId: string,
    dto: CreateCommentDto
  ): Promise<Comment> {
    await this.validateMember(projectId, userId);

    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.projectId !== projectId) {
      throw new NotFoundException('Task not found');
    }

    if (task.isArchived) {
      throw new BadRequestException('Cannot comment on archived task');
    }

    const member = await this.prisma.projectMember.findFirst({
      where: { projectId, userId },
    });

    if (!member) {
      throw new ForbiddenException('Not a project member');
    }

    return this.prisma.comment.create({
      data: {
        content: dto.content,
        taskId,
        authorId: member.id,
        projectId,
      },
      include: { author: true },
    });
  }

  async findAll(
    userId: string,
    projectId: string,
    taskId: string
  ): Promise<Comment[]> {
    await this.validateMember(projectId, userId);

    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.projectId !== projectId) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.comment.findMany({
      where: { taskId },
      include: { author: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(
    userId: string,
    projectId: string,
    taskId: string,
    commentId: string
  ): Promise<Comment> {
    await this.validateMember(projectId, userId);

    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: { author: true },
    });

    if (!comment || comment.taskId !== taskId || comment.projectId !== projectId) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async update(
    userId: string,
    projectId: string,
    taskId: string,
    commentId: string,
    dto: UpdateCommentDto
  ): Promise<Comment> {
    await this.validateMember(projectId, userId);

    const member = await this.prisma.projectMember.findFirst({
      where: { projectId, userId },
    });

    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.taskId !== taskId || comment.projectId !== projectId) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== member?.id) {
      throw new ForbiddenException('Cannot edit comment from another user');
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: {
        content: dto.content,
        isEdited: true,
      },
      include: { author: true },
    });
  }

  async delete(
    userId: string,
    projectId: string,
    taskId: string,
    commentId: string
  ): Promise<void> {
    await this.validateMember(projectId, userId);

    const member = await this.prisma.projectMember.findFirst({
      where: { projectId, userId },
    });

    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.taskId !== taskId || comment.projectId !== projectId) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== member?.id) {
      throw new ForbiddenException('Cannot delete comment from another user');
    }

    await this.prisma.comment.delete({ where: { id: commentId } });
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