import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRecipeDto: CreateRecipeDto) {
    try {
      return await this.prisma.recipe.create({
        data: createRecipeDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Une recette portant ce nom existe déjà.');
      }

      throw error;
    }
  }

  findAll() {
    return this.prisma.recipe.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: {
        id,
      },
    });

    if (!recipe) {
      throw new NotFoundException(`Aucune recette trouvée avec l'id ${id}`);
    }

    return recipe;
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto) {
    await this.findOne(id);

    return this.prisma.recipe.update({
      where: {
        id,
      },
      data: updateRecipeDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.recipe.delete({
      where: {
        id,
      },
    });
  }
}
