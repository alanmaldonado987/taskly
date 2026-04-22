import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('projects/:projectId/tasks/:taskId/attachments')
@UseGuards(JwtAuthGuard)
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Get()
  findAll(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string
  ) {
    return this.attachmentsService.findAll(req.user.id, projectId, taskId);
  }

  @Post()
  create(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Body() dto: { name: string; url: string; size: number; mimeType?: string; extension?: string }
  ) {
    return this.attachmentsService.create(req.user.id, projectId, taskId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Param('id') id: string
  ) {
    return this.attachmentsService.delete(req.user.id, projectId, taskId, id);
  }
}