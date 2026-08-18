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
import { AuthGuard } from '@nestjs/passport';

import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { IngredientsService } from './ingredients.service';

@ApiTags('Ingredients')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @ApiOperation({
    summary: 'Créer un ingrédient',
  })
  @ApiCreatedResponse({
    description: 'Ingrédient créé avec succès.',
  })
  @ApiConflictResponse({
    description: 'Un ingrédient avec ce nom existe déjà pour cet utilisateur.',
  })
  @Post()
  create(
    @Request() request: { user: { id: string; email: string } },
    @Body() createIngredientDto: CreateIngredientDto,
  ) {
    return this.ingredientsService.create(request.user.id, createIngredientDto);
  }

  @ApiOperation({
    summary: 'Récupérer les ingrédients de l’utilisateur connecté',
  })
  @Get()
  findAll(@Request() request: { user: { id: string; email: string } }) {
    return this.ingredientsService.findAll(request.user.id);
  }

  @ApiOperation({
    summary: 'Récupérer un ingrédient par son identifiant',
  })
  @ApiNotFoundResponse({
    description: 'Ingrédient introuvable.',
  })
  @Get(':id')
  findOne(
    @Request() request: { user: { id: string; email: string } },
    @Param('id') id: string,
  ) {
    return this.ingredientsService.findOne(id, request.user.id);
  }

  @ApiOperation({
    summary: 'Modifier un ingrédient',
  })
  @Patch(':id')
  update(
    @Request() request: { user: { id: string; email: string } },
    @Param('id') id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    return this.ingredientsService.update(
      id,
      request.user.id,
      updateIngredientDto,
    );
  }

  @ApiOperation({
    summary: 'Supprimer un ingrédient',
  })
  @Delete(':id')
  remove(
    @Request() request: { user: { id: string; email: string } },
    @Param('id') id: string,
  ) {
    return this.ingredientsService.remove(id, request.user.id);
  }
}
