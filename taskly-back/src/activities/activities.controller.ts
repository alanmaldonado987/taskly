import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('projects/:projectId/activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  findAll(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Query('taskId') taskId?: string,
    @Query('limit') limit?: string
  ) {
    return this.activitiesService.findAll(
      req.user.id,
      projectId,
      taskId,
      limit ? parseInt(limit) : 50
    );
  }
}