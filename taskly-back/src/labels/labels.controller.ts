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
import { LabelsService } from './labels.service';
import { CreateLabelDto, UpdateLabelDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('projects/:projectId/labels')
@UseGuards(JwtAuthGuard)
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Post()
  create(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Body() dto: CreateLabelDto
  ) {
    return this.labelsService.create(req.user.id, projectId, dto);
  }

  @Get()
  findAll(@Request() req: any, @Param('projectId') projectId: string) {
    return this.labelsService.findAll(req.user.id, projectId);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('projectId') projectId: string, @Param('id') id: string) {
    return this.labelsService.findOne(req.user.id, projectId, id);
  }

  @Put(':id')
  update(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() dto: UpdateLabelDto
  ) {
    return this.labelsService.update(req.user.id, projectId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Request() req: any, @Param('projectId') projectId: string, @Param('id') id: string) {
    return this.labelsService.delete(req.user.id, projectId, id);
  }

  @Post(':id/tasks/:taskId')
  addToTask(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Param('taskId') taskId: string
  ) {
    return this.labelsService.addToTask(req.user.id, projectId, id, taskId);
  }

  @Delete(':id/tasks/:taskId')
  removeFromTask(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Param('taskId') taskId: string
  ) {
    return this.labelsService.removeFromTask(req.user.id, projectId, id, taskId);
  }
}