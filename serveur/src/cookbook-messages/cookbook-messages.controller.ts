import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CookbookMessagesService } from './cookbook-messages.service';
import { CreateCookbookMessageDto } from './dto/create-cookbook-message.dto';
import { UpdateCookbookMessageDto } from './dto/update-cookbook-message.dto';

@ApiTags('Cookbook Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cookbooks/:cookbookId/messages')
export class CookbookMessagesController {
  constructor(
    private readonly cookbookMessagesService: CookbookMessagesService,
  ) {}

  @Get()
  @ApiOperation({
    summary: "Récupérer les messages d'un cookbook",
  })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Param('cookbookId') cookbookId: string,
  ) {
    return this.cookbookMessagesService.findAll(cookbookId, user.id);
  }

  @Post()
  @ApiOperation({
    summary: 'Envoyer un message dans un cookbook',
  })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Param('cookbookId') cookbookId: string,
    @Body() dto: CreateCookbookMessageDto,
  ) {
    return this.cookbookMessagesService.create(cookbookId, user.id, dto);
  }

  @Patch(':messageId')
  @ApiOperation({
    summary: 'Modifier son message',
  })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('cookbookId') cookbookId: string,
    @Param('messageId') messageId: string,
    @Body() dto: UpdateCookbookMessageDto,
  ) {
    return this.cookbookMessagesService.update(
      cookbookId,
      messageId,
      user.id,
      dto,
    );
  }

  @Delete(':messageId')
  @ApiOperation({
    summary: 'Supprimer un message',
  })
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('cookbookId') cookbookId: string,
    @Param('messageId') messageId: string,
  ) {
    return this.cookbookMessagesService.remove(cookbookId, messageId, user.id);
  }
}
