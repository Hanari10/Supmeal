import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createIngredientDto: CreateIngredientDto) {
    try {
      return await this.prisma.ingredient.create({
        data: createIngredientDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Un ingrédient portant ce nom existe déjà.',
        );
      }

      throw error;
    }
  }

  findAll() {
    return this.prisma.ingredient.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const ingredient = await this.prisma.ingredient.findUnique({
      where: {
        id,
      },
    });

    if (!ingredient) {
      throw new NotFoundException(`Aucun ingrédient trouvé avec l'id ${id}`);
    }

    return ingredient;
  }

  async update(id: string, updateIngredientDto: UpdateIngredientDto) {
    await this.findOne(id);

    return this.prisma.ingredient.update({
      where: {
        id,
      },
      data: updateIngredientDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    const recipeUsageCount = await this.prisma.recipeIngredient.count({
      where: {
        ingredientId: id,
      },
    });

    const shoppingListUsageCount = await this.prisma.shoppingListItem.count({
      where: {
        ingredientId: id,
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
