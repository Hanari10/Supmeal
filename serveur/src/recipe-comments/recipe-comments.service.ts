import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateRecipeCommentDto } from './dto/create-recipe-comment.dto';
import { UpdateRecipeCommentDto } from './dto/update-recipe-comment.dto';

@Injectable()
export class RecipeCommentsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getRecipeAndMembership(userId: string, recipeId: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: {
        id: recipeId,
      },
      select: {
        id: true,
        cookbookId: true,
      },
    });

    if (!recipe) {
      throw new NotFoundException('Recette introuvable.');
    }

    if (!recipe.cookbookId) {
      throw new ForbiddenException(
        'Les commentaires sont disponibles uniquement pour les recettes appartenant à un cookbook.',
      );
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
      throw new ForbiddenException("Vous n'avez pas accès à ce cookbook.");
    }

    return {
      recipe,
      membership,
    };
  }

  async findAll(userId: string, recipeId: string) {
    await this.getRecipeAndMembership(userId, recipeId);

    return this.prisma.recipeComment.findMany({
      where: {
        recipeId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async create(userId: string, recipeId: string, dto: CreateRecipeCommentDto) {
    const { membership } = await this.getRecipeAndMembership(userId, recipeId);

    if (!['CREATOR', 'EDITOR', 'COMMENTER'].includes(membership.role)) {
      throw new ForbiddenException(
        "Vous n'avez pas la permission de commenter cette recette.",
      );
    }

    return this.prisma.recipeComment.create({
      data: {
        recipeId,
        userId,
        content: dto.content,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
    });
  }

  async update(
    userId: string,
    recipeId: string,
    commentId: string,
    dto: UpdateRecipeCommentDto,
  ) {
    await this.getRecipeAndMembership(userId, recipeId);

    const comment = await this.prisma.recipeComment.findFirst({
      where: {
        id: commentId,
        recipeId,
      },
    });

    if (!comment) {
      throw new NotFoundException('Commentaire introuvable.');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException(
        'Vous pouvez uniquement modifier votre propre commentaire.',
      );
    }

    return this.prisma.recipeComment.update({
      where: {
        id: commentId,
      },
      data: {
        content: dto.content,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
    });
  }

  async remove(userId: string, recipeId: string, commentId: string) {
    const { recipe } = await this.getRecipeAndMembership(userId, recipeId);

    const comment = await this.prisma.recipeComment.findFirst({
      where: {
        id: commentId,
        recipeId,
      },
    });

    if (!comment) {
      throw new NotFoundException('Commentaire introuvable.');
    }

    const cookbook = await this.prisma.cookbook.findUnique({
      where: {
        id: recipe.cookbookId!,
      },
      select: {
        ownerId: true,
      },
    });

    const isOwner = comment.userId === userId;

    const isCreator = cookbook?.ownerId === userId;

    if (!isOwner && !isCreator) {
      throw new ForbiddenException(
        "Vous n'avez pas la permission de supprimer ce commentaire.",
      );
    }

    await this.prisma.recipeComment.delete({
      where: {
        id: commentId,
      },
    });

    return {
      message: 'Commentaire supprimé.',
    };
  }
}
