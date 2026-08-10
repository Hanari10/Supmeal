import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AddCookbookMemberDto } from './dto/add-cookbook-member.dto';
import { CreateCookbookDto } from './dto/create-cookbook.dto';
import { UpdateCookbookDto } from './dto/update-cookbook.dto';

@Injectable()
export class CookbooksService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, createCookbookDto: CreateCookbookDto) {
    return this.prisma.cookbook.create({
      data: {
        name: createCookbookDto.name,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: 'CREATOR',
          },
        },
      },
      include: {
        members: true,
        recipes: true,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.cookbook.findMany({
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
        members: true,
        recipes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(userId: string, id: string) {
    const cookbook = await this.prisma.cookbook.findFirst({
      where: {
        id,
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
        members: true,
        recipes: true,
      },
    });

    if (!cookbook) {
      throw new NotFoundException('Cookbook introuvable.');
    }

    return cookbook;
  }

  async update(
    userId: string,
    id: string,
    updateCookbookDto: UpdateCookbookDto,
  ) {
    const cookbook = await this.findOne(userId, id);

    if (cookbook.ownerId !== userId) {
      throw new ForbiddenException(
        'Seul le créateur peut modifier ce cookbook.',
      );
    }

    return this.prisma.cookbook.update({
      where: { id },
      data: updateCookbookDto,
    });
  }

  async remove(userId: string, id: string) {
    const cookbook = await this.findOne(userId, id);

    if (cookbook.ownerId !== userId) {
      throw new ForbiddenException(
        'Seul le créateur peut supprimer ce cookbook.',
      );
    }

    return this.prisma.cookbook.delete({
      where: { id },
    });
  }

  async addMember(
    userId: string,
    cookbookId: string,
    addCookbookMemberDto: AddCookbookMemberDto,
  ) {
    const cookbook = await this.findOne(userId, cookbookId);

    if (cookbook.ownerId !== userId) {
      throw new ForbiddenException(
        'Seul le créateur peut ajouter des membres.',
      );
    }

    const invitedUser = await this.prisma.user.findUnique({
      where: {
        email: addCookbookMemberDto.email,
      },
    });

    if (!invitedUser) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    const existingMember = await this.prisma.cookbookMember.findUnique({
      where: {
        cookbookId_userId: {
          cookbookId,
          userId: invitedUser.id,
        },
      },
    });

    if (existingMember) {
      throw new BadRequestException(
        'Cet utilisateur est déjà membre du cookbook.',
      );
    }

    return this.prisma.cookbookMember.create({
      data: {
        cookbookId,
        userId: invitedUser.id,
        role: addCookbookMemberDto.role,
      },
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
    });
  }

  async removeMember(userId: string, cookbookId: string, memberId: string) {
    const cookbook = await this.findOne(userId, cookbookId);

    if (cookbook.ownerId !== userId) {
      throw new ForbiddenException(
        'Seul le créateur peut supprimer des membres.',
      );
    }

    const member = await this.prisma.cookbookMember.findFirst({
      where: {
        id: memberId,
        cookbookId,
      },
    });

    if (!member) {
      throw new NotFoundException('Membre introuvable.');
    }

    if (member.userId === cookbook.ownerId) {
      throw new BadRequestException(
        'Le créateur ne peut pas être supprimé du cookbook.',
      );
    }

    return this.prisma.cookbookMember.delete({
      where: {
        id: memberId,
      },
    });
  }

  async addRecipe(userId: string, cookbookId: string, recipeId: string) {
    const cookbook = await this.findOne(userId, cookbookId);

    const membership = await this.prisma.cookbookMember.findUnique({
      where: {
        cookbookId_userId: {
          cookbookId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException("Vous n'avez pas accès à ce cookbook.");
    }

    if (!['CREATOR', 'EDITOR'].includes(membership.role)) {
      throw new ForbiddenException(
        "Vous n'avez pas la permission d'ajouter des recettes à ce cookbook.",
      );
    }

    const recipe = await this.prisma.recipe.findUnique({
      where: {
        id: recipeId,
      },
    });

    if (!recipe) {
      throw new NotFoundException('Recette introuvable.');
    }

    if (recipe.userId !== userId) {
      throw new ForbiddenException(
        'Vous ne pouvez ajouter que vos propres recettes.',
      );
    }

    if (recipe.cookbookId === cookbookId) {
      throw new BadRequestException(
        'Cette recette appartient déjà à ce cookbook.',
      );
    }

    if (recipe.cookbookId) {
      throw new BadRequestException(
        'Cette recette appartient déjà à un autre cookbook.',
      );
    }

    await this.prisma.recipe.update({
      where: {
        id: recipeId,
      },
      data: {
        cookbookId,
      },
    });

    return this.findOne(userId, cookbook.id);
  }

  async removeRecipe(userId: string, cookbookId: string, recipeId: string) {
    const cookbook = await this.findOne(userId, cookbookId);

    const membership = await this.prisma.cookbookMember.findUnique({
      where: {
        cookbookId_userId: {
          cookbookId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException("Vous n'avez pas accès à ce cookbook.");
    }

    const recipe = await this.prisma.recipe.findUnique({
      where: {
        id: recipeId,
      },
    });

    if (!recipe || recipe.cookbookId !== cookbookId) {
      throw new NotFoundException(
        'Cette recette est introuvable dans ce cookbook.',
      );
    }

    const canRemove =
      cookbook.ownerId === userId ||
      recipe.userId === userId ||
      membership.role === 'EDITOR';

    if (!canRemove) {
      throw new ForbiddenException(
        "Vous n'avez pas la permission de retirer cette recette.",
      );
    }

    await this.prisma.recipe.update({
      where: {
        id: recipeId,
      },
      data: {
        cookbookId: null,
      },
    });

    return this.findOne(userId, cookbookId);
  }
}
