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
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@ApiTags('Ingredients')
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
    description: 'Un ingrédient avec ce nom existe déjà.',
  })
  @Post()
  create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientsService.create(createIngredientDto);
  }

  @ApiOperation({
    summary: 'Récupérer tous les ingrédients',
  })
  @Get()
  findAll() {
    return this.ingredientsService.findAll();
  }

  @ApiOperation({
    summary: 'Récupérer un ingrédient par son identifiant',
  })
  @ApiNotFoundResponse({
    description: 'Ingrédient introuvable.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ingredientsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Modifier un ingrédient',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    return this.ingredientsService.update(id, updateIngredientDto);
  }

  @ApiOperation({
    summary: 'Supprimer un ingrédient',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ingredientsService.remove(id);
  }
}
