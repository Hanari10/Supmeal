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

  private async checkRecipeReadAccess(recipeId: string, userId: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: {
        id: recipeId,
      },
    });

    if (!recipe) {
      throw new NotFoundException('Recette non trouvée.');
    }

    if (recipe.userId === userId) {
      return recipe;
    }

    if (!recipe.cookbookId) {
      throw new ForbiddenException("Vous n'avez pas accès à cette recette.");
    }

    const membership = await this.prisma.cookbookMember.findUnique({
      where: {
        cookbookId_userId: {
          cookbookId: recipe.cookbookId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException("Vous n'avez pas accès à cette recette.");
    }

    return recipe;
  }

  private async checkRecipeWriteAccess(recipeId: string, userId: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: {
        id: recipeId,
      },
    });

    if (!recipe) {
      throw new NotFoundException('Recette non trouvée.');
    }

    if (recipe.userId !== userId) {
      throw new ForbiddenException(
        'Seul le propriétaire de la recette peut modifier ses ingrédients.',
      );
    }

    return recipe;
  }

  async create(
    recipeId: string,
    userId: string,
    dto: CreateRecipeIngredientDto,
  ) {
    await this.checkRecipeWriteAccess(recipeId, userId);

    const ingredient = await this.prisma.ingredient.findUnique({
      where: {
        id: dto.ingredientId,
      },
    });

    if (!ingredient) {
      throw new NotFoundException('Ingrédient non trouvé.');
    }

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
    await this.checkRecipeReadAccess(recipeId, userId);

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
    await this.checkRecipeWriteAccess(recipeId, userId);

    const recipeIngredient = await this.prisma.recipeIngredient.findUnique({
      where: {
        recipeId_ingredientId: {
          recipeId,
          ingredientId,
        },
      },
    });

    if (!recipeIngredient) {
      throw new NotFoundException('Ingrédient non trouvé dans la recette.');
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
    await this.checkRecipeWriteAccess(recipeId, userId);

    const recipeIngredient = await this.prisma.recipeIngredient.findUnique({
      where: {
        recipeId_ingredientId: {
          recipeId,
          ingredientId,
        },
      },
    });

    if (!recipeIngredient) {
      throw new NotFoundException('Ingrédient non trouvé dans la recette.');
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
