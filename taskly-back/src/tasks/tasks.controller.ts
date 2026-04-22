import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, AssignMemberDto, AddDependencyDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TaskStatus, TaskPriority } from '../types';

@Controller('projects/:projectId/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Body() dto: CreateTaskDto
  ) {
    return this.tasksService.create(req.user.id, projectId, dto);
  }

  @Get()
  findAll(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Query('status') status?: TaskStatus,
    @Query('priority') priority?: TaskPriority,
    @Query('assigneeId') assigneeId?: string
  ) {
    return this.tasksService.findAll(req.user.id, projectId, { status, priority, assigneeId });
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('projectId') projectId: string, @Param('id') id: string) {
    return this.tasksService.findOne(req.user.id, projectId, id);
  }

  @Put(':id')
  update(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto
  ) {
    return this.tasksService.update(req.user.id, projectId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Request() req: any, @Param('projectId') projectId: string, @Param('id') id: string) {
    return this.tasksService.delete(req.user.id, projectId, id);
  }

  @Post(':id/assignees')
  assignMember(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() dto: AssignMemberDto
  ) {
    return this.tasksService.assignMember(req.user.id, projectId, id, dto.memberId);
  }

  @Delete(':id/assignees/:memberId')
  removeAssignee(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Param('memberId') memberId: string
  ) {
    return this.tasksService.removeAssignee(req.user.id, projectId, id, memberId);
  }

  @Post(':id/dependencies')
  addDependency(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() dto: AddDependencyDto
  ) {
    return this.tasksService.addDependency(req.user.id, projectId, id, dto.dependsOnId);
  }

  @Delete(':id/dependencies/:dependsOnId')
  removeDependency(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Param('dependsOnId') dependsOnId: string
  ) {
    return this.tasksService.removeDependency(req.user.id, projectId, id, dependsOnId);
  }
}