import { IsString, IsOptional, IsEmail, IsEnum, IsNumber, IsUUID } from 'class-validator';
import { ProjectRole } from '../../types';

export class CreateMemberDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsEnum(ProjectRole)
  @IsOptional()
  role?: ProjectRole;

  @IsNumber()
  @IsOptional()
  hoursPerWeek?: number;
}

export class UpdateMemberDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsNumber()
  @IsOptional()
  hoursPerWeek?: number;
}

export class UpdateRoleDto {
  @IsEnum(ProjectRole)
  role: ProjectRole;
}