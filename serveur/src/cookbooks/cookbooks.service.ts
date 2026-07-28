import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCookbookDto } from './dto/create-cookbook.dto';
import { UpdateCookbookDto } from './dto/update-cookbook.dto';
import { AddCookbookMemberDto } from './dto/add-cookbook-member.dto';

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
}
