import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createIngredientDto: CreateIngredientDto) {
    try {
      return await this.prisma.ingredient.create({
        data: {
          ...createIngredientDto,
          userId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Un ingrédient portant ce nom existe déjà dans votre liste.',
        );
      }

      throw error;
    }
  }

  findAll(userId: string) {
    return this.prisma.ingredient.findMany({
      where: {
        userId,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const ingredient = await this.prisma.ingredient.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!ingredient) {
      throw new NotFoundException('Ingrédient introuvable.');
    }

    return ingredient;
  }

  async update(
    id: string,
    userId: string,
    updateIngredientDto: UpdateIngredientDto,
  ) {
    await this.findOne(id, userId);

    try {
      return await this.prisma.ingredient.update({
        where: {
          id,
        },
        data: updateIngredientDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Un ingrédient portant ce nom existe déjà dans votre liste.',
        );
      }

      throw error;
    }
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    const recipeUsageCount = await this.prisma.recipeIngredient.count({
      where: {
        ingredientId: id,
        recipe: {
          userId,
        },
      },
    });

    const shoppingListUsageCount = await this.prisma.shoppingListItem.count({
      where: {
        ingredientId: id,
        shoppingList: {
          userId,
        },
      },
    });

    if (recipeUsageCount > 0 || shoppingListUsageCount > 0) {
      throw new ConflictException(
        'Cet ingrédient ne peut pas être supprimé car il est utilisé dans une recette ou une liste de courses.',
      );
    }

    return this.prisma.ingredient.delete({
      where: {
        id,
      },
    });
  }
}
