import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FavoritesService } from './favorites.service';

@ApiTags('favorites')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiOperation({
    summary: 'Ajouter une recette aux favoris',
  })
  @ApiCreatedResponse({
    description: 'Recette ajoutée aux favoris.',
  })
  @ApiConflictResponse({
    description: 'Cette recette est déjà dans les favoris.',
  })
  @ApiNotFoundResponse({
    description: 'Recette introuvable.',
  })
  @Post(':recipeId')
  create(
    @Request() request: { user: { id: string; email: string } },
    @Param('recipeId') recipeId: string,
  ) {
    return this.favoritesService.create(request.user.id, recipeId);
  }

  @ApiOperation({
    summary: 'Lister mes recettes favorites',
  })
  @ApiOkResponse({
    description: 'Liste des favoris.',
  })
  @Get()
  findAll(@Request() request: { user: { id: string; email: string } }) {
    return this.favoritesService.findAll(request.user.id);
  }

  @ApiOperation({
    summary: 'Retirer une recette des favoris',
  })
  @ApiNotFoundResponse({
    description: 'Favori introuvable.',
  })
  @Delete(':recipeId')
  remove(
    @Request() request: { user: { id: string; email: string } },
    @Param('recipeId') recipeId: string,
  ) {
    return this.favoritesService.remove(request.user.id, recipeId);
  }
}
