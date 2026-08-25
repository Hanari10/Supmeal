import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { RecipeCommentsController } from './recipe-comments.controller';
import { RecipeCommentsService } from './recipe-comments.service';

@Module({
  imports: [PrismaModule],
  controllers: [RecipeCommentsController],
  providers: [RecipeCommentsService],
})
export class RecipeCommentsModule {}
