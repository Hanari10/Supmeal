import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { SearchRecipesDto } from './dto/search-recipes.dto';
import { RecipesService } from './recipes.service';

@ApiTags('recipes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @ApiOperation({
    summary: 'Créer une recette',
  })
  @ApiCreatedResponse({
    description: 'Recette créée.',
  })
  @Post()
  create(
    @Request() request: { user: { id: string; email: string } },
    @Body() createRecipeDto: CreateRecipeDto,
  ) {
    return this.recipesService.create(request.user.id, createRecipeDto);
  }

  @ApiOperation({
    summary: 'Lister les recettes',
  })
  @ApiOkResponse({
    description: 'Liste des recettes.',
  })
  @Get()
  findAll(@Request() request: { user: { id: string; email: string } }) {
    return this.recipesService.findAll(request.user.id);
  }

  @ApiOperation({
    summary: 'Récupérer une recette',
  })
  @ApiNotFoundResponse({
    description: 'Recette introuvable.',
  })
  @ApiOperation({
    summary: 'Rechercher des recettes',
  })
  @Get('search')
  search(
    @Request() request: { user: { id: string; email: string } },
    @Query() filters: SearchRecipesDto,
  ) {
    return this.recipesService.search(request.user.id, filters);
  }
  @Get(':id')
  findOne(
    @Request() request: { user: { id: string; email: string } },
    @Param('id') id: string,
  ) {
    return this.recipesService.findOne(id, request.user.id);
  }

  @ApiOperation({
    summary: 'Modifier une recette',
  })
  @ApiNotFoundResponse({
    description: 'Recette introuvable.',
  })
  @Patch(':id')
  update(
    @Request() request: { user: { id: string; email: string } },
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return this.recipesService.update(id, request.user.id, updateRecipeDto);
  }

  @ApiOperation({
    summary: 'Supprimer une recette',
  })
  @ApiNotFoundResponse({
    description: 'Recette introuvable.',
  })
  @Delete(':id')
  remove(
    @Request() request: { user: { id: string; email: string } },
    @Param('id') id: string,
  ) {
    return this.recipesService.remove(id, request.user.id);
  }
}
