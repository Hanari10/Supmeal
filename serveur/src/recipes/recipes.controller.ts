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
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Recipes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @ApiOperation({
    summary: 'Créer une recette',
  })
  @ApiCreatedResponse({
    description: 'Recette créée avec succès.',
  })
  @ApiConflictResponse({
    description: 'Une recette portant ce nom existe déjà.',
  })
  @Post()
  create(
    @Request() request: { user: { id: string; email: string } },
    @Body() createRecipeDto: CreateRecipeDto,
  ) {
    return this.recipesService.create(request.user.id, createRecipeDto);
  }

  @ApiOperation({
    summary: 'Récupérer toutes les recettes',
  })
  @Get()
  findAll(@Request() request: { user: { id: string; email: string } }) {
    return this.recipesService.findAll(request.user.id);
  }

  @ApiOperation({
    summary: 'Récupérer une recette par son identifiant',
  })
  @ApiNotFoundResponse({
    description: 'Recette introuvable.',
  })
  @Get(':id')
  findOne(
    @Request() request: { user: { id: string; email: string } },
    @Param('id') id: string,
  ) {
    return this.recipesService.findOne(request.user.id, id);
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
    return this.recipesService.update(request.user.id, id, updateRecipeDto);
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
    return this.recipesService.remove(request.user.id, id);
  }
}
