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
import { MembersService } from './members.service';
import { CreateMemberDto, UpdateMemberDto, UpdateRoleDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('projects/:projectId/members')
@UseGuards(JwtAuthGuard)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  create(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Body() dto: CreateMemberDto
  ) {
    return this.membersService.create(req.user.id, projectId, dto);
  }

  @Get()
  findAll(@Request() req: any, @Param('projectId') projectId: string) {
    return this.membersService.findAll(req.user.id, projectId);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('projectId') projectId: string, @Param('id') id: string) {
    return this.membersService.findOne(req.user.id, projectId, id);
  }

  @Put(':id')
  update(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() dto: UpdateMemberDto
  ) {
    return this.membersService.update(req.user.id, projectId, id, dto);
  }

  @Put(':id/role')
  updateRole(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() dto: UpdateRoleDto
  ) {
    return this.membersService.updateRole(req.user.id, projectId, id, dto.role);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Request() req: any, @Param('projectId') projectId: string, @Param('id') id: string) {
    return this.membersService.remove(req.user.id, projectId, id);
  }
}