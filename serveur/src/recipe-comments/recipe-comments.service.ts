import { Injectable } from '@nestjs/common';
import { CreateRecipeCommentDto } from './dto/create-recipe-comment.dto';
import { UpdateRecipeCommentDto } from './dto/update-recipe-comment.dto';

@Injectable()
export class RecipeCommentsService {
  create(createRecipeCommentDto: CreateRecipeCommentDto) {
    return 'This action adds a new recipeComment';
  }

  findAll() {
    return `This action returns all recipeComments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recipeComment`;
  }

  update(id: number, updateRecipeCommentDto: UpdateRecipeCommentDto) {
    return `This action updates a #${id} recipeComment`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipeComment`;
  }
}
