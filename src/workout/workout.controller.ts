import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkoutService } from './workout.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { Request } from 'express';

interface AuthRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}

@Controller('workouts')
@UseGuards(JwtAuthGuard)
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Post()
  create(@Body() dto: CreateWorkoutDto, @Req() req: AuthRequest) {
    return this.workoutService.create(dto, req.user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: AuthRequest) {
    return this.workoutService.findAll(req.user.id, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.workoutService.findOne(id, req.user.id, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateWorkoutDto,
    @Req() req: AuthRequest,
  ) {
    return this.workoutService.update(id, dto, req.user.id, req.user.role);
  }
}
