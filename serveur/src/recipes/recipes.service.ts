import {
  //ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
//import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createRecipeDto: CreateRecipeDto) {
    return this.prisma.recipe.create({
      data: {
        ...createRecipeDto,
        userId,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.recipe.findMany({
      where: {
        userId,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(userId: string, id: string) {
    const recipe = await this.prisma.recipe.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!recipe) {
      throw new NotFoundException(`Aucune recette trouvée avec l'id ${id}`);
    }

    return recipe;
  }

  async update(userId: string, id: string, updateRecipeDto: UpdateRecipeDto) {
    await this.findOne(userId, id);

    return this.prisma.recipe.update({
      where: {
        id,
      },
      data: updateRecipeDto,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.recipe.delete({
      where: {
        id,
      },
    });
  }
}
