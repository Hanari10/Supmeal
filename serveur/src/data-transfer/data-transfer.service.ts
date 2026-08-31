import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

interface ImportedIngredient {
  name: string;
  category?: string | null;
  defaultMeasurementUnit?: string | null;
}

interface ImportedRecipeIngredient {
  quantity: number;
  unit?: string | null;
  order?: number | null;
  ingredient: ImportedIngredient;
}

interface ImportedRecipeTag {
  tag: {
    name: string;
  };
}

interface ImportedRecipe {
  name: string;
  description?: string | null;
  preparationTime?: number | null;
  cookingTime?: number | null;
  servings?: number | null;
  difficulty?: string | null;
  imageUrl?: string | null;
  sourceUrl?: string | null;
  instructions?: string | null;
  cookbookId?: string | null;
  recipeIngredients?: ImportedRecipeIngredient[];
  tags?: ImportedRecipeTag[];
}

interface ImportedCookbook {
  name: string;
  recipes?: ImportedRecipe[];
}

interface SupmealImportFile {
  format: string;
  version: number;
  recipes: ImportedRecipe[];
  cookbooks: ImportedCookbook[];
}

@Injectable()
export class DataTransferService {
  constructor(private readonly prisma: PrismaService) {}

  async exportUserData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        defaultServings: true,
        dietaryPreferences: true,
        allergies: true,
        preferredCuisines: true,
      },
    });

    const recipes = await this.prisma.recipe.findMany({
      where: {
        userId,
      },
      include: {
        recipeIngredients: {
          include: {
            ingredient: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const cookbooks = await this.prisma.cookbook.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        recipes: {
          include: {
            recipeIngredients: {
              include: {
                ingredient: true,
              },
            },
            tags: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return {
      format: 'SUPMEAL',
      version: 1,
      exportedAt: new Date().toISOString(),
      warning:
        'Ce fichier contient des données lisibles en clair. Conservez-le dans un emplacement sécurisé.',
      user,
      recipes,
      cookbooks,
    };
  }

  async importUserData(userId: string, fileBuffer: Buffer) {
    let parsedData: unknown;

    try {
      parsedData = JSON.parse(fileBuffer.toString('utf8')) as unknown;
    } catch {
      throw new BadRequestException(
        'Le fichier fourni ne contient pas un JSON valide.',
      );
    }

    if (!this.isValidImportFile(parsedData)) {
      throw new BadRequestException(
        "Le fichier ne correspond pas au format d'export SUPMEAL.",
      );
    }

    let importedRecipes = 0;
    let importedCookbooks = 0;

    await this.prisma.$transaction(async (transaction) => {
      const personalRecipes = parsedData.recipes.filter(
        (recipe) => !recipe.cookbookId,
      );

      for (const recipe of personalRecipes) {
        await this.importRecipe(transaction, userId, recipe);
        importedRecipes += 1;
      }

      for (const importedCookbook of parsedData.cookbooks) {
        const cookbook = await transaction.cookbook.create({
          data: {
            name: importedCookbook.name,
            ownerId: userId,
            members: {
              create: {
                userId,
                role: 'CREATOR',
              },
            },
          },
        });

        importedCookbooks += 1;

        for (const recipe of importedCookbook.recipes ?? []) {
          await this.importRecipe(transaction, userId, recipe, cookbook.id);

          importedRecipes += 1;
        }
      }
    });

    return {
      message: 'Import terminé avec succès.',
      importedRecipes,
      importedCookbooks,
    };
  }

  private async importRecipe(
    transaction: Parameters<Parameters<PrismaService['$transaction']>[0]>[0],
    userId: string,
    importedRecipe: ImportedRecipe,
    cookbookId?: string,
  ) {
    const recipe = await transaction.recipe.create({
      data: {
        userId,
        cookbookId,
        name: importedRecipe.name,
        description: importedRecipe.description ?? null,
        preparationTime: importedRecipe.preparationTime ?? null,
        cookingTime: importedRecipe.cookingTime ?? null,
        servings: importedRecipe.servings ?? null,
        difficulty: importedRecipe.difficulty ?? null,
        imageUrl: importedRecipe.imageUrl ?? null,
        sourceUrl: importedRecipe.sourceUrl ?? null,
        instructions: importedRecipe.instructions ?? '',
      },
    });

    for (const importedRecipeIngredient of importedRecipe.recipeIngredients ??
      []) {
      const importedIngredient = importedRecipeIngredient.ingredient;

      const ingredient = await transaction.ingredient.upsert({
        where: {
          userId_name: {
            userId,
            name: importedIngredient.name,
          },
        },
        update: {
          category: importedIngredient.category,
          defaultMeasurementUnit: importedIngredient.defaultMeasurementUnit,
        },
        create: {
          name: importedIngredient.name,
          category: importedIngredient.category,
          defaultMeasurementUnit: importedIngredient.defaultMeasurementUnit,
          userId,
        },
      });

      await transaction.recipeIngredient.create({
        data: {
          recipeId: recipe.id,
          ingredientId: ingredient.id,
          quantity: importedRecipeIngredient.quantity,
          unit: importedRecipeIngredient.unit ?? null,
          order: importedRecipeIngredient.order ?? null,
        },
      });
    }

    const uniqueTagNames = [
      ...new Set(
        (importedRecipe.tags ?? [])
          .map((recipeTag) => recipeTag.tag.name.trim())
          .filter((tagName) => tagName.length > 0),
      ),
    ];

    for (const tagName of uniqueTagNames) {
      const tag = await transaction.tag.upsert({
        where: {
          name: tagName,
        },
        update: {},
        create: {
          name: tagName,
        },
      });

      await transaction.recipeTag.create({
        data: {
          recipeId: recipe.id,
          tagId: tag.id,
        },
      });
    }

    return recipe;
  }

  private isValidImportFile(data: unknown): data is SupmealImportFile {
    if (typeof data !== 'object' || data === null) {
      return false;
    }

    const candidate = data as Record<string, unknown>;

    return (
      candidate.format === 'SUPMEAL' &&
      candidate.version === 1 &&
      Array.isArray(candidate.recipes) &&
      Array.isArray(candidate.cookbooks)
    );
  }
}
