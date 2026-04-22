import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('projects/:projectId/tasks/:taskId/comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Body() dto: CreateCommentDto
  ) {
    return this.commentsService.create(req.user.id, projectId, taskId, dto);
  }

  @Get()
  findAll(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string
  ) {
    return this.commentsService.findAll(req.user.id, projectId, taskId);
  }

  @Get(':id')
  findOne(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Param('id') id: string
  ) {
    return this.commentsService.findOne(req.user.id, projectId, taskId, id);
  }

  @Put(':id')
  update(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto
  ) {
    return this.commentsService.update(req.user.id, projectId, taskId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Param('id') id: string
  ) {
    return this.commentsService.delete(req.user.id, projectId, taskId, id);
  }
}