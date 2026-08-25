import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';
import { CookbookMessagesGateway } from './cookbook-messages.gateway';
import { CreateCookbookMessageDto } from './dto/create-cookbook-message.dto';
import { UpdateCookbookMessageDto } from './dto/update-cookbook-message.dto';

@Injectable()
export class CookbookMessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: CookbookMessagesGateway,
  ) {}

  private async checkCookbookAccess(cookbookId: string, userId: string) {
    const cookbook = await this.prisma.cookbook.findUnique({
      where: {
        id: cookbookId,
      },
      select: {
        id: true,
        ownerId: true,
      },
    });

    if (!cookbook) {
      throw new NotFoundException('Cookbook introuvable.');
    }

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

    return {
      cookbook,
      membership,
    };
  }

  async findAll(cookbookId: string, userId: string) {
    await this.checkCookbookAccess(cookbookId, userId);

    return this.prisma.cookbookMessage.findMany({
      where: {
        cookbookId,
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

  async create(
    cookbookId: string,
    userId: string,
    dto: CreateCookbookMessageDto,
  ) {
    await this.checkCookbookAccess(cookbookId, userId);

    const message = await this.prisma.cookbookMessage.create({
      data: {
        cookbookId,
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

    this.gateway.emitMessageCreated(cookbookId, message);

    return message;
  }

  async update(
    cookbookId: string,
    messageId: string,
    userId: string,
    dto: UpdateCookbookMessageDto,
  ) {
    await this.checkCookbookAccess(cookbookId, userId);

    const message = await this.prisma.cookbookMessage.findFirst({
      where: {
        id: messageId,
        cookbookId,
      },
    });

    if (!message) {
      throw new NotFoundException('Message introuvable.');
    }

    if (message.userId !== userId) {
      throw new ForbiddenException(
        'Vous pouvez uniquement modifier vos propres messages.',
      );
    }

    const updatedMessage = await this.prisma.cookbookMessage.update({
      where: {
        id: messageId,
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

    this.gateway.emitMessageUpdated(cookbookId, updatedMessage);

    return updatedMessage;
  }

  async remove(cookbookId: string, messageId: string, userId: string) {
    const { cookbook } = await this.checkCookbookAccess(cookbookId, userId);

    const message = await this.prisma.cookbookMessage.findFirst({
      where: {
        id: messageId,
        cookbookId,
      },
    });

    if (!message) {
      throw new NotFoundException('Message introuvable.');
    }

    const isAuthor = message.userId === userId;

    const isCookbookCreator = cookbook.ownerId === userId;

    if (!isAuthor && !isCookbookCreator) {
      throw new ForbiddenException(
        "Vous n'avez pas la permission de supprimer ce message.",
      );
    }

    await this.prisma.cookbookMessage.delete({
      where: {
        id: messageId,
      },
    });

    this.gateway.emitMessageDeleted(cookbookId, messageId);

    return {
      message: 'Message supprimé.',
    };
  }
}
