import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { Task, ProjectMember } from '@prisma/client';

interface FindAllOptions {
  status?: string;
  priority?: string;
  assigneeId?: string;
}

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, projectId: string, dto: CreateTaskDto): Promise<Task> {
    const project = await this.getProjectWithMember(projectId, userId);

    return this.prisma.task.create({
      data: {
        name: dto.name,
        description: dto.description,
        startDate: dto.startDate,
        endDate: dto.endDate,
        progress: dto.progress || 0,
        status: dto.status || 'OPEN',
        priority: dto.priority || 'MEDIUM',
        color: dto.color || this.generateColor(project.settings?.taskColors),
        isMilestone: dto.isMilestone || false,
        estimatedHours: dto.estimatedHours,
        parentId: dto.parentId || null,
        projectId: projectId,
      },
      include: {
        assignees: true,
        parent: true,
        children: true,
        dependsOn: true,
        dependents: true,
      },
    });
  }

  async findAll(userId: string, projectId: string, options: FindAllOptions): Promise<Task[]> {
    await this.validateMember(projectId, userId);

    const where: Record<string, unknown> = { projectId };

    if (options.status) where.status = options.status;
    if (options.priority) where.priority = options.priority;
    if (options.assigneeId) {
      where.assignees = { some: { id: options.assigneeId } };
    }

    return this.prisma.task.findMany({
      where,
      include: {
        assignees: true,
        parent: true,
        children: true,
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(userId: string, projectId: string, taskId: string): Promise<Task> {
    await this.validateMember(projectId, userId);

    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignees: true,
        parent: true,
        children: true,
        dependsOn: { include: { dependsOn: true } },
        dependents: { include: { task: true } },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.projectId !== projectId) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(
    userId: string,
    projectId: string,
    taskId: string,
    dto: UpdateTaskDto
  ): Promise<Task> {
    const project = await this.getProjectWithMember(projectId, userId);
    await this.validateCanEdit(project, userId);

    const task = await this.prisma.task.findUnique({ where: { id: taskId } });

    if (!task || task.projectId !== projectId) {
      throw new NotFoundException('Task not found');
    }

    if (task.isArchived) {
      throw new BadRequestException('Cannot update archived task');
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        name: dto.name,
        description: dto.description,
        startDate: dto.startDate,
        endDate: dto.endDate,
        progress: dto.progress,
        status: dto.status,
        priority: dto.priority,
        color: dto.color,
        isMilestone: dto.isMilestone,
        estimatedHours: dto.estimatedHours,
        loggedHours: dto.loggedHours,
        sortOrder: dto.sortOrder,
      },
      include: {
        assignees: true,
        parent: true,
        children: true,
      },
    });
  }

  async delete(userId: string, projectId: string, taskId: string): Promise<void> {
    const project = await this.getProjectWithMember(projectId, userId);
    await this.validateCanEdit(project, userId);

    const task = await this.prisma.task.findUnique({ where: { id: taskId } });

    if (!task || task.projectId !== projectId) {
      throw new NotFoundException('Task not found');
    }

    await this.prisma.task.update({
      where: { id: taskId },
      data: { isArchived: true },
    });
  }

  async assignMember(
    userId: string,
    projectId: string,
    taskId: string,
    memberId: string
  ): Promise<Task> {
    await this.validateMember(projectId, userId);

    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.projectId !== projectId) {
      throw new NotFoundException('Task not found');
    }

    const member = await this.prisma.projectMember.findFirst({
      where: { id: memberId, projectId },
    });
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        assignees: { connect: { id: memberId } },
      },
      include: { assignees: true },
    });
  }

  async removeAssignee(
    userId: string,
    projectId: string,
    taskId: string,
    memberId: string
  ): Promise<Task> {
    await this.validateMember(projectId, userId);

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        assignees: { disconnect: { id: memberId } },
      },
      include: { assignees: true },
    });
  }

  async addDependency(
    userId: string,
    projectId: string,
    taskId: string,
    dependsOnId: string
  ): Promise<Task> {
    await this.validateMember(projectId, userId);

    if (taskId === dependsOnId) {
      throw new BadRequestException('Task cannot depend on itself');
    }

    const exists = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!exists || exists.projectId !== projectId) {
      throw new NotFoundException('Task not found');
    }

    const depExists = await this.prisma.task.findUnique({ where: { id: dependsOnId } });
    if (!depExists || depExists.projectId !== projectId) {
      throw new NotFoundException('Dependency task not found');
    }

    const hasCircular = await this.checkCircularDependency(taskId, dependsOnId);
    if (hasCircular) {
      throw new BadRequestException('Circular dependency detected');
    }

    await this.prisma.taskDependency.upsert({
      where: { taskId_dependsOnId: { taskId, dependsOnId } },
      create: { taskId, dependsOnId },
      update: { taskId, dependsOnId },
    });

    return this.findOne(userId, projectId, taskId);
  }

  async removeDependency(
    userId: string,
    projectId: string,
    taskId: string,
    dependsOnId: string
  ): Promise<Task> {
    await this.validateMember(projectId, userId);

    await this.prisma.taskDependency.deleteMany({
      where: { taskId, dependsOnId },
    });

    return this.findOne(userId, projectId, taskId);
  }

  private async getProjectWithMember(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        settings: true,
        members: true,
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

  private async validateCanEdit(project: any, userId: string) {
    const member = project.members.find((m) => m.userId === userId);
    if (!member || (member.role !== 'OWNER' && member.role !== 'ADMIN')) {
      throw new ForbiddenException('Only admins can edit tasks');
    }
  }

  private async checkCircularDependency(taskId: string, dependsOnId: string): Promise<boolean> {
    const visited = new Set<string>();
    let current = dependsOnId;

    while (current) {
      if (current === taskId) return true;
      if (visited.has(current)) return false;

      visited.add(current);
      const dep = await this.prisma.taskDependency.findFirst({
        where: { taskId: current },
      });
      current = dep?.dependsOnId || '';
    }

    return false;
  }

  private generateColor(colors?: string[]): string {
    const defaultColors = [
      '#ef4444', '#f97316', '#eab308', '#22c55e',
      '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
    ];
    const palette = colors || defaultColors;
    return palette[Math.floor(Math.random() * palette.length)];
  }
}