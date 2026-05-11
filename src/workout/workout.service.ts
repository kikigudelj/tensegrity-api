import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import {
  UpdateWorkoutDto,
  UpdateWorkoutExerciseDto,
} from './dto/update-workout.dto';

@Injectable()
export class WorkoutService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWorkoutDto, userId: string) {
    // 1. pronađi usera koji kreira workout
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. pronađi clienta
    const client = await this.prisma.user.findUnique({
      where: { id: dto.clientId },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    // 3. provjeri da je client stvarno CLIENT
    if (client.role !== 'CLIENT') {
      throw new BadRequestException('Selected user is not a client');
    }

    // 4. client može kreirati samo sebi
    if (user.role === 'CLIENT' && dto.clientId !== userId) {
      throw new ForbiddenException(
        'Clients can create workouts only for themselves',
      );
    }

    // 5. validacija exercise ID-eva
    const exerciseIds = dto.exercises.map((e) => e.exerciseId);

    const existingExercises = await this.prisma.exercise.findMany({
      where: {
        id: {
          in: exerciseIds,
        },
      },
    });

    if (existingExercises.length !== exerciseIds.length) {
      throw new BadRequestException('Some exercises do not exist');
    }
    return this.prisma.workout.create({
      data: {
        title: dto.title,
        clientId: dto.clientId,
        assignedById: userId,
        type: dto.type,
        scheduledDate: new Date(dto.scheduledDate),

        exercises: {
          create: dto.exercises.map((exercise, index) => ({
            order: index,

            exercise: {
              connect: {
                id: exercise.exerciseId,
              },
            },

            sets: exercise.sets,
            reps: exercise.reps,
            duration: exercise.duration,
            weight: exercise.weight,
            rpe: exercise.rpe,
            restSeconds: exercise.restSeconds,
            note: exercise.note,
          })),
        },
      },

      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    });
  }

  async findAll(userId: string, role: string) {
    // ADMIN vidi sve
    if (role === 'ADMIN') {
      return this.prisma.workout.findMany({
        include: {
          exercises: {
            include: {
              exercise: true,
            },
          },

          client: true,
          assignedBy: true,
        },
      });
    }

    // CLIENT vidi samo svoje
    return this.prisma.workout.findMany({
      where: {
        clientId: userId,
      },

      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },

        client: true,
        assignedBy: true,
      },
    });
  }

  async findOne(id: string, userId: string, role: string) {
    const workout = await this.prisma.workout.findUnique({
      where: { id },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
        client: true,
        assignedBy: true,
      },
    });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    // ADMIN vidi sve
    if (role === 'ADMIN') {
      return workout;
    }

    // CLIENT vidi samo svoj
    if (workout.clientId !== userId) {
      throw new ForbiddenException('You cannot access this workout');
    }

    return workout;
  }

  async update(
    id: string,
    dto: UpdateWorkoutDto,
    userId: string,
    role: string,
  ) {
    const workout = await this.prisma.workout.findUnique({
      where: { id },
      include: {
        exercises: true,
      },
    });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    // 🔐 ownership check
    if (role !== 'ADMIN' && workout.clientId !== userId) {
      throw new ForbiddenException('No access to this workout');
    }

    if (role === 'ADMIN') {
      return this.prisma.workout.update({
        where: { id },
        data: {
          title: dto.title,

          scheduledDate: dto.scheduledDate
            ? new Date(dto.scheduledDate)
            : undefined,

          type: dto.type,

          exercises: dto.exercises
            ? {
                update: dto.exercises.map((ex: UpdateWorkoutExerciseDto) => ({
                  where: {
                    id: ex.workoutExerciseId,
                  },
                  data: {
                    sets: ex.sets,
                    reps: ex.reps,
                    weight: ex.weight,
                    duration: ex.duration,
                    rpe: ex.rpe,
                    vas: ex.vas,
                    restSeconds: ex.restSeconds,
                    note: ex.note,
                    order: ex.order,
                  },
                })),
              }
            : undefined,
        },

        include: {
          exercises: {
            include: {
              exercise: true,
            },
          },
          client: true,
          assignedBy: true,
        },
      });
    }

    // =========================
    // 👤 CLIENT UPDATE (LIMITED)
    // =========================
    return this.prisma.workout.update({
      where: { id },

      data: {
        exercises: dto.exercises
          ? {
              update: dto.exercises.map((ex: UpdateWorkoutExerciseDto) => ({
                where: {
                  id: ex.workoutExerciseId,
                },
                data: {
                  rpe: ex.rpe,
                  vas: ex.vas,
                  note: ex.note,
                },
              })),
            }
          : undefined,
      },

      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
        client: true,
        assignedBy: true,
      },
    });
  }
}
