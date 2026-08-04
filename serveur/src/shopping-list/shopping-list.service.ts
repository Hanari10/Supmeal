import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateShoppingListItemDto } from './dto/create-shopping-list-item.dto';
import { UpdateShoppingListItemDto } from './dto/update-shopping-list-item.dto';

@Injectable()
export class ShoppingListService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    const shoppingList = await this.prisma.shoppingList.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            ingredient: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!shoppingList) {
      return {
        items: [],
      };
    }

    return shoppingList;
  }

  async create(
    userId: string,
    createShoppingListItemDto: CreateShoppingListItemDto,
  ) {
    const ingredient = await this.prisma.ingredient.findUnique({
      where: {
        id: createShoppingListItemDto.ingredientId,
      },
    });

    if (!ingredient) {
      throw new NotFoundException(
        `Aucun ingrédient trouvé avec l'id ${createShoppingListItemDto.ingredientId}`,
      );
    }

    const shoppingList = await this.prisma.shoppingList.upsert({
      where: {
        userId,
      },
      update: {},
      create: {
        userId,
      },
    });

    const unit = createShoppingListItemDto.unit ?? null;

    const existingItem = await this.prisma.shoppingListItem.findFirst({
      where: {
        shoppingListId: shoppingList.id,
        ingredientId: createShoppingListItemDto.ingredientId,
        unit,
      },
    });

    if (existingItem) {
      return this.prisma.shoppingListItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: existingItem.quantity + createShoppingListItemDto.quantity,
        },
        include: {
          ingredient: true,
        },
      });
    }

    return this.prisma.shoppingListItem.create({
      data: {
        shoppingListId: shoppingList.id,
        ingredientId: createShoppingListItemDto.ingredientId,
        quantity: createShoppingListItemDto.quantity,
        unit,
      },
      include: {
        ingredient: true,
      },
    });
  }

  async generateFromMealPlan(userId: string) {
    const mealPlans = await this.prisma.mealPlan.findMany({
      where: {
        userId,
      },
      include: {
        recipe: {
          include: {
            recipeIngredients: true,
          },
        },
      },
    });

    if (mealPlans.length === 0) {
      throw new NotFoundException(
        'Aucun repas planifié pour générer la liste de courses.',
      );
    }

    const groupedIngredients = new Map<
      string,
      {
        ingredientId: string;
        quantity: number;
        unit: string | null;
      }
    >();

    for (const mealPlan of mealPlans) {
      const originalServings = mealPlan.recipe.servings ?? 1;

      const plannedServings = mealPlan.servings ?? originalServings;

      const multiplier = plannedServings / originalServings;

      for (const recipeIngredient of mealPlan.recipe.recipeIngredients) {
        const unit = recipeIngredient.unit ?? null;
        const quantity = recipeIngredient.quantity * multiplier;

        const key = `${recipeIngredient.ingredientId}-${unit ?? 'sans-unite'}`;

        const existing = groupedIngredients.get(key);

        if (existing) {
          existing.quantity += quantity;
        } else {
          groupedIngredients.set(key, {
            ingredientId: recipeIngredient.ingredientId,
            quantity,
            unit,
          });
        }
      }
    }

    const shoppingList = await this.prisma.shoppingList.upsert({
      where: {
        userId,
      },
      update: {},
      create: {
        userId,
      },
    });

    await this.prisma.shoppingListItem.deleteMany({
      where: {
        shoppingListId: shoppingList.id,
      },
    });

    await this.prisma.shoppingListItem.createMany({
      data: Array.from(groupedIngredients.values()).map((ingredient) => ({
        shoppingListId: shoppingList.id,
        ingredientId: ingredient.ingredientId,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
      })),
    });

    return this.prisma.shoppingList.findUnique({
      where: {
        id: shoppingList.id,
      },
      include: {
        items: {
          include: {
            ingredient: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  }

  async update(
    userId: string,
    itemId: string,
    updateShoppingListItemDto: UpdateShoppingListItemDto,
  ) {
    const item = await this.findItem(userId, itemId);

    if (updateShoppingListItemDto.ingredientId) {
      const ingredient = await this.prisma.ingredient.findUnique({
        where: {
          id: updateShoppingListItemDto.ingredientId,
        },
      });

      if (!ingredient) {
        throw new NotFoundException(
          `Aucun ingrédient trouvé avec l'id ${updateShoppingListItemDto.ingredientId}`,
        );
      }
    }

    return this.prisma.shoppingListItem.update({
      where: {
        id: item.id,
      },
      data: updateShoppingListItemDto,
      include: {
        ingredient: true,
      },
    });
  }

  async remove(userId: string, itemId: string) {
    const item = await this.findItem(userId, itemId);

    return this.prisma.shoppingListItem.delete({
      where: {
        id: item.id,
      },
    });
  }

  private async findItem(userId: string, itemId: string) {
    const item = await this.prisma.shoppingListItem.findFirst({
      where: {
        id: itemId,
        shoppingList: {
          userId,
        },
      },
    });

    if (!item) {
      throw new NotFoundException(
        `Aucun élément de liste trouvé avec l'id ${itemId}`,
      );
    }

    return item;
  }
}
