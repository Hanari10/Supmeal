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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { RecipeIngredientsService } from './recipe-ingredients.service';
import { CreateRecipeIngredientDto } from './dto/create-recipe-ingredient.dto';
import { UpdateRecipeIngredientDto } from './dto/update-recipe-ingredient.dto';

@ApiTags('recipe-ingredients')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('recipes/:recipeId/ingredients')
export class RecipeIngredientsController {
  constructor(
    private readonly recipeIngredientsService: RecipeIngredientsService,
  ) {}

  @Post()
  create(
    @Request() request: { user: { id: string; email: string } },
    @Param('recipeId') recipeId: string,
    @Body() createRecipeIngredientDto: CreateRecipeIngredientDto,
  ) {
    return this.recipeIngredientsService.create(
      recipeId,
      request.user.id,
      createRecipeIngredientDto,
    );
  }

  @Get()
  findAll(
    @Request() request: { user: { id: string; email: string } },
    @Param('recipeId') recipeId: string,
  ) {
    return this.recipeIngredientsService.findAll(recipeId, request.user.id);
  }

  @Patch(':ingredientId')
  update(
    @Request() request: { user: { id: string; email: string } },
    @Param('recipeId') recipeId: string,
    @Param('ingredientId') ingredientId: string,
    @Body() updateRecipeIngredientDto: UpdateRecipeIngredientDto,
  ) {
    return this.recipeIngredientsService.update(
      recipeId,
      ingredientId,
      request.user.id,
      updateRecipeIngredientDto,
    );
  }

  @Delete(':ingredientId')
  remove(
    @Request() request: { user: { id: string; email: string } },
    @Param('recipeId') recipeId: string,
    @Param('ingredientId') ingredientId: string,
  ) {
    return this.recipeIngredientsService.remove(
      recipeId,
      ingredientId,
      request.user.id,
    );
  }
}
