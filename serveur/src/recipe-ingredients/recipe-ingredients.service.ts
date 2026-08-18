import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';
import { CreateRecipeIngredientDto } from './dto/create-recipe-ingredient.dto';
import { UpdateRecipeIngredientDto } from './dto/update-recipe-ingredient.dto';

@Injectable()
export class RecipeIngredientsService {
  constructor(private readonly prisma: PrismaService) {}

  private async checkRecipeAccess(recipeId: string, userId: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: {
        id: recipeId,
      },
    });

    if (!recipe) {
      throw new NotFoundException('Recette non trouvée.');
    }

    if (recipe.userId !== userId) {
      throw new ForbiddenException("Vous n'avez pas accès à cette recette.");
    }

    return recipe;
  }

  private async checkIngredientAccess(ingredientId: string, userId: string) {
    const ingredient = await this.prisma.ingredient.findUnique({
      where: {
        id: ingredientId,
      },
    });

    if (!ingredient) {
      throw new NotFoundException('Ingrédient non trouvé.');
    }

    if (ingredient.userId !== userId) {
      throw new ForbiddenException("Vous n'avez pas accès à cet ingrédient.");
    }

    return ingredient;
  }

  async create(
    recipeId: string,
    userId: string,
    dto: CreateRecipeIngredientDto,
  ) {
    await this.checkRecipeAccess(recipeId, userId);
    await this.checkIngredientAccess(dto.ingredientId, userId);

    const existingRecipeIngredient =
      await this.prisma.recipeIngredient.findUnique({
        where: {
          recipeId_ingredientId: {
            recipeId,
            ingredientId: dto.ingredientId,
          },
        },
      });

    if (existingRecipeIngredient) {
      throw new ConflictException('Cet ingrédient est déjà dans la recette.');
    }

    return this.prisma.recipeIngredient.create({
      data: {
        recipeId,
        ingredientId: dto.ingredientId,
        quantity: dto.quantity,
        unit: dto.unit,
        order: dto.order,
      },
      include: {
        ingredient: true,
      },
    });
  }

  async findAll(recipeId: string, userId: string) {
    await this.checkRecipeAccess(recipeId, userId);

    return this.prisma.recipeIngredient.findMany({
      where: {
        recipeId,
      },
      include: {
        ingredient: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async update(
    recipeId: string,
    ingredientId: string,
    userId: string,
    dto: UpdateRecipeIngredientDto,
  ) {
    await this.checkRecipeAccess(recipeId, userId);

    const recipeIngredient = await this.prisma.recipeIngredient.findUnique({
      where: {
        recipeId_ingredientId: {
          recipeId,
          ingredientId,
        },
      },
      include: {
        ingredient: true,
      },
    });

    if (!recipeIngredient) {
      throw new NotFoundException('Ingrédient non trouvé dans la recette.');
    }

    if (recipeIngredient.ingredient.userId !== userId) {
      throw new ForbiddenException("Vous n'avez pas accès à cet ingrédient.");
    }

    return this.prisma.recipeIngredient.update({
      where: {
        recipeId_ingredientId: {
          recipeId,
          ingredientId,
        },
      },
      data: {
        quantity: dto.quantity,
        unit: dto.unit,
        order: dto.order,
      },
      include: {
        ingredient: true,
      },
    });
  }

  async remove(recipeId: string, ingredientId: string, userId: string) {
    await this.checkRecipeAccess(recipeId, userId);

    const recipeIngredient = await this.prisma.recipeIngredient.findUnique({
      where: {
        recipeId_ingredientId: {
          recipeId,
          ingredientId,
        },
      },
      include: {
        ingredient: true,
      },
    });

    if (!recipeIngredient) {
      throw new NotFoundException('Ingrédient non trouvé dans la recette.');
    }

    if (recipeIngredient.ingredient.userId !== userId) {
      throw new ForbiddenException("Vous n'avez pas accès à cet ingrédient.");
    }

    return this.prisma.recipeIngredient.delete({
      where: {
        recipeId_ingredientId: {
          recipeId,
          ingredientId,
        },
      },
    });
  }
}
