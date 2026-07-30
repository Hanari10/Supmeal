import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateMealPlanDto } from './dto/create-meal-plan.dto';
import { UpdateMealPlanDto } from './dto/update-meal-plan.dto';

@Injectable()
export class MealPlansService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateMealPlanDto) {
    const recipe = await this.prisma.recipe.findUnique({
      where: {
        id: dto.recipeId,
      },
    });

    if (!recipe) {
      throw new NotFoundException('Recette introuvable.');
    }

    const existing = await this.prisma.mealPlan.findUnique({
      where: {
        userId_day_mealType: {
          userId,
          day: dto.day,
          mealType: dto.mealType,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Un repas est déjà planifié à ce créneau.');
    }

    return this.prisma.mealPlan.create({
      data: {
        userId,
        recipeId: dto.recipeId,
        day: dto.day,
        mealType: dto.mealType,
      },
      include: {
        recipe: {
          include: {
            tags: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.mealPlan.findMany({
      where: {
        userId,
      },
      include: {
        recipe: {
          include: {
            tags: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          day: 'asc',
        },
        {
          mealType: 'asc',
        },
      ],
    });
  }

  async update(id: string, userId: string, dto: UpdateMealPlanDto) {
    const mealPlan = await this.prisma.mealPlan.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!mealPlan) {
      throw new NotFoundException('Repas planifié introuvable.');
    }

    return this.prisma.mealPlan.update({
      where: {
        id,
      },
      data: dto,
      include: {
        recipe: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    const mealPlan = await this.prisma.mealPlan.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!mealPlan) {
      throw new NotFoundException('Repas planifié introuvable.');
    }

    return this.prisma.mealPlan.delete({
      where: {
        id,
      },
    });
  }
}
