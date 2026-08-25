import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { SearchRecipesDto } from './dto/search-recipes.dto';

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createRecipeDto: CreateRecipeDto) {
    const { tags, ...recipeData } = createRecipeDto;

    const uniqueTags = [...new Set(tags ?? [])];

    return this.prisma.recipe.create({
      data: {
        ...recipeData,
        userId,
        tags: {
          create: uniqueTags.map((tagName) => ({
            tag: {
              connectOrCreate: {
                where: {
                  name: tagName,
                },
                create: {
                  name: tagName,
                },
              },
            },
          })),
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        recipeIngredients: {
          include: {
            ingredient: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.recipe.findMany({
      where: {
        userId,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        recipeIngredients: {
          include: {
            ingredient: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: {
        id,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },

        recipeIngredients: {
          include: {
            ingredient: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!recipe) {
      throw new NotFoundException('Recette introuvable.');
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

  async update(id: string, userId: string, updateRecipeDto: UpdateRecipeDto) {
    const existingRecipe = await this.prisma.recipe.findUnique({
      where: {
        id,
      },
      select: {
        userId: true,
      },
    });

    if (!existingRecipe) {
      throw new NotFoundException('Recette introuvable.');
    }

    if (existingRecipe.userId !== userId) {
      throw new ForbiddenException(
        'Seul le propriétaire peut modifier cette recette.',
      );
    }

    const { tags, ...recipeData } = updateRecipeDto;
    const uniqueTags = tags ? [...new Set(tags)] : undefined;

    return this.prisma.recipe.update({
      where: {
        id,
      },
      data: {
        ...recipeData,

        ...(uniqueTags !== undefined && {
          tags: {
            deleteMany: {},
            create: uniqueTags.map((tagName) => ({
              tag: {
                connectOrCreate: {
                  where: {
                    name: tagName,
                  },
                  create: {
                    name: tagName,
                  },
                },
              },
            })),
          },
        }),
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        recipeIngredients: {
          include: {
            ingredient: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.recipe.delete({
      where: {
        id,
      },
    });
  }

  async search(userId: string, filters: SearchRecipesDto) {
    return this.prisma.recipe.findMany({
      where: {
        userId,

        ...(filters.query && {
          OR: [
            {
              name: {
                contains: filters.query,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: filters.query,
                mode: 'insensitive',
              },
            },
            {
              instructions: {
                contains: filters.query,
                mode: 'insensitive',
              },
            },
            {
              recipeIngredients: {
                some: {
                  ingredient: {
                    name: {
                      contains: filters.query,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            },
            {
              tags: {
                some: {
                  tag: {
                    name: {
                      contains: filters.query,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            },
          ],
        }),

        ...(filters.difficulty && {
          difficulty: {
            equals: filters.difficulty,
            mode: 'insensitive',
          },
        }),

        ...(filters.maxPreparationTime !== undefined && {
          preparationTime: {
            lte: filters.maxPreparationTime,
          },
        }),

        ...(filters.maxCookingTime !== undefined && {
          cookingTime: {
            lte: filters.maxCookingTime,
          },
        }),

        ...(filters.tag && {
          tags: {
            some: {
              tag: {
                name: {
                  contains: filters.tag,
                  mode: 'insensitive',
                },
              },
            },
          },
        }),

        ...(filters.ingredient && {
          recipeIngredients: {
            some: {
              ingredient: {
                name: {
                  contains: filters.ingredient,
                  mode: 'insensitive',
                },
              },
            },
          },
        }),

        ...(filters.cookbookId && {
          cookbookId: filters.cookbookId,
        }),

        ...(filters.favorite === true && {
          favorites: {
            some: {
              userId,
            },
          },
        }),
      },

      include: {
        tags: {
          include: {
            tag: true,
          },
        },

        recipeIngredients: {
          include: {
            ingredient: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
