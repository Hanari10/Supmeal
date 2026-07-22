import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateRecipeIngredientDto } from './dto/create-recipe-ingredient.dto';
import { UpdateRecipeIngredientDto } from './dto/update-recipe-ingredient.dto';

@Injectable()
export class RecipeIngredientsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(recipeId: string, dto: CreateRecipeIngredientDto) {
    const recipe = await this.prisma.recipe.findUnique({
      where: {
        id: recipeId,
      },
    });

    if (!recipe) {
      throw new NotFoundException('Recette non trouvée');
    }

    const ingredient = await this.prisma.ingredient.findUnique({
      where: {
        id: dto.ingredientId,
      },
    });

    if (!ingredient) {
      throw new NotFoundException('Ingrédieent non trouvé');
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
      throw new ConflictException('Cet ingrédient est déjà dans la recette');
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
  async findAll(recipeId: string) {
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
    dto: UpdateRecipeIngredientDto,
  ) {
    const recipeIngredient = await this.prisma.recipeIngredient.findUnique({
      where: {
        recipeId_ingredientId: {
          recipeId,
          ingredientId,
        },
      },
    });

    if (!recipeIngredient) {
      throw new NotFoundException('Ingrédient non trouvé dans la recette');
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

  async remove(recipeId: string, ingredientId: string) {
    const recipeIngredient = await this.prisma.recipeIngredient.findUnique({
      where: {
        recipeId_ingredientId: {
          recipeId,
          ingredientId,
        },
      },
    });

    if (!recipeIngredient) {
      throw new NotFoundException('Ingrédient non trouvé dans la recette');
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
