import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@ApiTags('Recipes')
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
  create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipesService.create(createRecipeDto);
  }

  @ApiOperation({
    summary: 'Récupérer toutes les recettes',
  })
  @Get()
  findAll() {
    return this.recipesService.findAll();
  }

  @ApiOperation({
    summary: 'Récupérer une recette par son identifiant',
  })
  @ApiNotFoundResponse({
    description: 'Recette introuvable.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  @ApiOperation({
    summary: 'Modifier une recette',
  })
  @ApiNotFoundResponse({
    description: 'Recette introuvable.',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipesService.update(id, updateRecipeDto);
  }

  @ApiOperation({
    summary: 'Supprimer une recette',
  })
  @ApiNotFoundResponse({
    description: 'Recette introuvable.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recipesService.remove(id);
  }
}
