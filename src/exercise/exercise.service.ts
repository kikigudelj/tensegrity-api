import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ExerciseCategory } from '@prisma/client';

@Injectable()
export class ExerciseService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateExerciseDto, userId: string) {
    return this.prisma.exercise.create({
      data: {
        ...dto,
        createdById: userId,
      },
    });
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);

    return this.prisma.exercise.findMany({
      where: {
        ...(query.category && { category: query.category as ExerciseCategory }),
        ...(query.search && {
          name: {
            contains: query.search,
            mode: 'insensitive',
          },
        }),
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.exercise.findUnique({
      where: { id },
    });
  }

  async update(id: string, dto: UpdateExerciseDto) {
    return this.prisma.exercise.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.exercise.delete({
      where: { id },
    });
  }
}
