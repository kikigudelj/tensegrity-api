import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { WorkoutType } from '@prisma/client';

export class CreateWorkoutDto {
  @IsString()
  title: string;

  @IsString()
  clientId: string;

  @IsEnum(WorkoutType)
  type: WorkoutType;

  @IsDateString()
  scheduledDate: string;

  @IsArray()
  exercises: CreateWorkoutExerciseDto[];
}

export class CreateWorkoutExerciseDto {
  @IsString()
  exerciseId: string;

  @IsOptional()
  sets?: number;

  @IsOptional()
  reps?: number;

  @IsOptional()
  weight?: number;

  @IsOptional()
  duration?: number;

  @IsOptional()
  rpe?: number;

  @IsOptional()
  restSeconds?: number;

  @IsOptional()
  note?: string;

  //@Min(0)
  //@Max(10)
  //rpe?: number;

  //@Min(0)
  //@Max(10)
  //vas?: number;
}
