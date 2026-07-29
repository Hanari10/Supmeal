import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, recipeId: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: {
        id: recipeId,
      },
    });

    if (!recipe) {
      throw new NotFoundException('Recette introuvable.');
    }

    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    });

    if (existingFavorite) {
      throw new ConflictException('Cette recette est déjà dans les favoris.');
    }

    return this.prisma.favorite.create({
      data: {
        userId,
        recipeId,
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
    return this.prisma.favorite.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async remove(userId: string, recipeId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favori introuvable.');
    }

    return this.prisma.favorite.delete({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    });
  }
}
