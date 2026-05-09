import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

import { ExerciseCategory } from '@prisma/client';

export class CreateExerciseDto {
  @IsEnum(ExerciseCategory)
  category: ExerciseCategory;

  @IsOptional()
  @IsString()
  subcategory?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  videoUrl?: string;
}
