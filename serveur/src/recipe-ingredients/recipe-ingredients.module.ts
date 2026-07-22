import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { RecipeIngredientsController } from './recipe-ingredients.controller';
import { RecipeIngredientsService } from './recipe-ingredients.service';

@Module({
  imports: [PrismaModule],
  controllers: [RecipeIngredientsController],
  providers: [RecipeIngredientsService],
})
export class RecipeIngredientsModule {}
