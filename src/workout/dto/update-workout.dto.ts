import {
  IsArray,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
} from 'class-validator';

import { WorkoutType } from '@prisma/client';

export class UpdateWorkoutDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsDateString()
  scheduledDate?: string;

  @IsOptional()
  @IsEnum(WorkoutType)
  type?: WorkoutType;

  @IsOptional()
  @IsArray()
  exercises?: UpdateWorkoutExerciseDto[];
}

export class UpdateWorkoutExerciseDto {
  @IsString()
  workoutExerciseId: string;

  @IsOptional()
  @IsNumber()
  sets?: number;

  @IsOptional()
  @IsNumber()
  reps?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsNumber()
  rpe?: number;

  @IsOptional()
  @IsNumber()
  vas?: number;

  @IsOptional()
  @IsNumber()
  restSeconds?: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}
