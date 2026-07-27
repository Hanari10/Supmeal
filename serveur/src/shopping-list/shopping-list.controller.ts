import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateShoppingListItemDto } from './dto/create-shopping-list-item.dto';
import { UpdateShoppingListItemDto } from './dto/update-shopping-list-item.dto';
import { ShoppingListService } from './shopping-list.service';

type AuthenticatedRequest = {
  user: {
    id: string;
    email: string;
  };
};

@ApiTags('Shopping list')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('shopping-list')
export class ShoppingListController {
  constructor(private readonly shoppingListService: ShoppingListService) {}

  @ApiOperation({
    summary: "Récupérer la liste de courses de l'utilisateur",
  })
  @ApiOkResponse({
    description: 'Liste de courses récupérée avec succès.',
  })
  @Get()
  findAll(@Request() request: AuthenticatedRequest) {
    return this.shoppingListService.findAll(request.user.id);
  }

  @ApiOperation({
    summary: 'Ajouter un ingrédient à la liste de courses',
  })
  @ApiCreatedResponse({
    description: 'Ingrédient ajouté à la liste de courses.',
  })
  @ApiNotFoundResponse({
    description: 'Ingrédient introuvable.',
  })
  @Post('items')
  create(
    @Request() request: AuthenticatedRequest,
    @Body() createShoppingListItemDto: CreateShoppingListItemDto,
  ) {
    return this.shoppingListService.create(
      request.user.id,
      createShoppingListItemDto,
    );
  }

  @ApiOperation({
    summary: 'Modifier un élément de la liste de courses',
  })
  @ApiOkResponse({
    description: 'Élément modifié avec succès.',
  })
  @ApiNotFoundResponse({
    description: 'Élément ou ingrédient introuvable.',
  })
  @Patch('items/:id')
  update(
    @Request() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateShoppingListItemDto: UpdateShoppingListItemDto,
  ) {
    return this.shoppingListService.update(
      request.user.id,
      id,
      updateShoppingListItemDto,
    );
  }

  @ApiOperation({
    summary: 'Supprimer un élément de la liste de courses',
  })
  @ApiOkResponse({
    description: 'Élément supprimé avec succès.',
  })
  @ApiNotFoundResponse({
    description: 'Élément introuvable.',
  })
  @Delete('items/:id')
  remove(@Request() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.shoppingListService.remove(request.user.id, id);
  }
}
