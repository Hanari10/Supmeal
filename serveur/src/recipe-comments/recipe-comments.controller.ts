import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecipeCommentsService } from './recipe-comments.service';
import { CreateRecipeCommentDto } from './dto/create-recipe-comment.dto';
import { UpdateRecipeCommentDto } from './dto/update-recipe-comment.dto';

@Controller('recipe-comments')
export class RecipeCommentsController {
  constructor(private readonly recipeCommentsService: RecipeCommentsService) {}

  @Post()
  create(@Body() createRecipeCommentDto: CreateRecipeCommentDto) {
    return this.recipeCommentsService.create(createRecipeCommentDto);
  }

  @Get()
  findAll() {
    return this.recipeCommentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipeCommentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecipeCommentDto: UpdateRecipeCommentDto) {
    return this.recipeCommentsService.update(+id, updateRecipeCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recipeCommentsService.remove(+id);
  }
}
