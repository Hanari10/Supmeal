import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RecipeIngredientsService } from './recipe-ingredients.service';
import { CreateRecipeIngredientDto } from './dto/create-recipe-ingredient.dto';
import { UpdateRecipeIngredientDto } from './dto/update-recipe-ingredient.dto';

@Controller('recipes/:recipeId/ingredients')
export class RecipeIngredientsController {
  constructor(
    private readonly recipeIngredientsService: RecipeIngredientsService,
  ) {}

  @Post()
  create(
    @Param('recipeId') recipeId: string,
    @Body() createRecipeIngredientDto: CreateRecipeIngredientDto,
  ) {
    return this.recipeIngredientsService.create(
      recipeId,
      createRecipeIngredientDto,
    );
  }
  @Get()
  findAll(@Param('recipeId') recipeId: string) {
    return this.recipeIngredientsService.findAll(recipeId);
  }
  @Patch(':ingredientId')
  update(
    @Param('recipeId') recipeId: string,
    @Param('ingredientId') ingredientId: string,
    @Body() updateRecipeIngredientDto: UpdateRecipeIngredientDto,
  ) {
    return this.recipeIngredientsService.update(
      recipeId,
      ingredientId,
      updateRecipeIngredientDto,
    );
  }

  @Delete(':ingredientId')
  remove(
    @Param('recipeId') recipeId: string,
    @Param('ingredientId') ingredientId: string,
  ) {
    return this.recipeIngredientsService.remove(recipeId, ingredientId);
  }
}
