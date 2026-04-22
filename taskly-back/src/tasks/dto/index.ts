import { IsString, IsOptional, IsDateString, IsNumber, IsBoolean, IsArray, IsEnum, IsUUID, Min, Max } from 'class-validator';
import { TaskStatus, TaskPriority } from '../../types';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  progress?: number;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsString()
  @IsOptional()
  color?: string;

  @IsBoolean()
  @IsOptional()
  isMilestone?: boolean;

  @IsNumber()
  @IsOptional()
  estimatedHours?: number;

  @IsUUID()
  @IsOptional()
  parentId?: string;
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  progress?: number;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsString()
  @IsOptional()
  color?: string;

  @IsBoolean()
  @IsOptional()
  isMilestone?: boolean;

  @IsNumber()
  @IsOptional()
  estimatedHours?: number;

  @IsNumber()
  @IsOptional()
  loggedHours?: number;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}

export class AssignMemberDto {
  @IsUUID()
  memberId: string;
}

export class AddDependencyDto {
  @IsUUID()
  dependsOnId: string;
}