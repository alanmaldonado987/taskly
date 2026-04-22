import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectMember } from '@prisma/client';
import { CreateMemberDto, UpdateMemberDto } from './dto';

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, projectId: string, dto: CreateMemberDto): Promise<ProjectMember> {
    const project = await this.getProjectWithMember(projectId, userId);
    this.validateCanAddMember(project, userId);

    if (!dto.email) {
      throw new BadRequestException('Email is required');
    }

    const existing = await this.prisma.projectMember.findUnique({
      where: { projectId_email: { projectId, email: dto.email } },
    });

    if (existing) {
      throw new ConflictException('Member already exists in project');
    }

    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    return this.prisma.projectMember.create({
      data: {
        name: dto.name,
        email: dto.email!,
        color: dto.color || this.generateColor(project.settings?.taskColors),
        role: dto.role || 'MEMBER',
        hoursPerWeek: dto.hoursPerWeek || 40,
        userId: user?.id,
        projectId: projectId,
      },
    });
  }

  async findAll(userId: string, projectId: string): Promise<ProjectMember[]> {
    await this.validateMember(projectId, userId);

    return this.prisma.projectMember.findMany({
      where: { projectId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(userId: string, projectId: string, memberId: string): Promise<ProjectMember> {
    await this.validateMember(projectId, userId);

    const member = await this.prisma.projectMember.findUnique({
      where: { id: memberId },
      include: { user: true },
    });

    if (!member || member.projectId !== projectId) {
      throw new NotFoundException('Member not found');
    }

    return member;
  }

  async update(
    userId: string,
    projectId: string,
    memberId: string,
    dto: UpdateMemberDto
  ): Promise<ProjectMember> {
    const project = await this.getProjectWithMember(projectId, userId);
    const currentMember = project.members.find((m) => m.userId === userId);
    const targetMember = await this.prisma.projectMember.findUnique({ where: { id: memberId } });

    if (!targetMember || targetMember.projectId !== projectId) {
      throw new NotFoundException('Member not found');
    }

    const isSelf = currentMember?.userId === targetMember.userId;
    const canEdit = currentMember?.role === 'OWNER' || currentMember?.role === 'ADMIN';

    if (!isSelf && !canEdit) {
      throw new ForbiddenException('Cannot edit other members');
    }

    return this.prisma.projectMember.update({
      where: { id: memberId },
      data: {
        name: dto.name,
        color: dto.color,
        avatar: dto.avatar,
        hoursPerWeek: dto.hoursPerWeek,
      },
    });
  }

  async updateRole(
    userId: string,
    projectId: string,
    memberId: string,
    newRole: string
  ): Promise<ProjectMember> {
    const project = await this.getProjectWithMember(projectId, userId);
    const currentMember = project.members.find((m) => m.userId === userId);
    const targetMember = await this.prisma.projectMember.findUnique({ where: { id: memberId } });

    if (!targetMember || targetMember.projectId !== projectId) {
      throw new NotFoundException('Member not found');
    }

    if (currentMember?.role !== 'OWNER') {
      throw new ForbiddenException('Only owner can change roles');
    }

    if (targetMember.role === 'OWNER') {
      throw new BadRequestException('Cannot change owner role');
    }

    return this.prisma.projectMember.update({
      where: { id: memberId },
      data: { role: newRole as 'ADMIN' | 'MEMBER' | 'VIEWER' },
    });
  }

  async remove(userId: string, projectId: string, memberId: string): Promise<void> {
    const project = await this.getProjectWithMember(projectId, userId);
    const currentMember = project.members.find((m) => m.userId === userId);
    const targetMember = await this.prisma.projectMember.findUnique({ where: { id: memberId } });

    if (!targetMember || targetMember.projectId !== projectId) {
      throw new NotFoundException('Member not found');
    }

    if (currentMember?.role !== 'OWNER' && currentMember?.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can remove members');
    }

    if (targetMember.role === 'OWNER') {
      throw new ForbiddenException('Cannot remove owner');
    }

    await this.prisma.projectMember.delete({ where: { id: memberId } });
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

  private validateCanAddMember(project: any, userId: string) {
    const member = project.members.find((m) => m.userId === userId);
    if (!member || (member.role !== 'OWNER' && member.role !== 'ADMIN')) {
      throw new ForbiddenException('Only admins can add members');
    }
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