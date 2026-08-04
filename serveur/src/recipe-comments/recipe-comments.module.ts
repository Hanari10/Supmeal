import { Module } from '@nestjs/common';
import { RecipeCommentsService } from './recipe-comments.service';
import { RecipeCommentsController } from './recipe-comments.controller';

@Module({
  controllers: [RecipeCommentsController],
  providers: [RecipeCommentsService],
})
export class RecipeCommentsModule {}
