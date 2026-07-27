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

    return this.prisma.shoppingListItem.create({
      data: {
        shoppingListId: shoppingList.id,
        ingredientId: createShoppingListItemDto.ingredientId,
        quantity: createShoppingListItemDto.quantity,
        unit: createShoppingListItemDto.unit,
      },
      include: {
        ingredient: true,
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
