import { IsString, IsOptional, IsHexColor } from 'class-validator';

export class CreateLabelDto {
  @IsString()
  name: string;

  @IsHexColor()
  @IsOptional()
  color?: string;
}

export class UpdateLabelDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsHexColor()
  @IsOptional()
  color?: string;
}