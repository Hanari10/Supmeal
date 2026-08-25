import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRecipeCommentDto } from './dto/create-recipe-comment.dto';
import { UpdateRecipeCommentDto } from './dto/update-recipe-comment.dto';
import { RecipeCommentsService } from './recipe-comments.service';

@ApiTags('Recipe Comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('recipes/:recipeId/comments')
export class RecipeCommentsController {
  constructor(private readonly recipeCommentsService: RecipeCommentsService) {}

  @Get()
  @ApiOperation({
    summary: "Récupérer les commentaires d'une recette",
  })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Param('recipeId') recipeId: string,
  ) {
    return this.recipeCommentsService.findAll(user.id, recipeId);
  }

  @Post()
  @ApiOperation({
    summary: 'Ajouter un commentaire',
  })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Param('recipeId') recipeId: string,
    @Body()
    dto: CreateRecipeCommentDto,
  ) {
    return this.recipeCommentsService.create(user.id, recipeId, dto);
  }

  @Patch(':commentId')
  @ApiOperation({
    summary: 'Modifier son commentaire',
  })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('recipeId') recipeId: string,
    @Param('commentId') commentId: string,
    @Body()
    dto: UpdateRecipeCommentDto,
  ) {
    return this.recipeCommentsService.update(user.id, recipeId, commentId, dto);
  }

  @Delete(':commentId')
  @ApiOperation({
    summary: 'Supprimer un commentaire',
  })
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('recipeId') recipeId: string,
    @Param('commentId') commentId: string,
  ) {
    return this.recipeCommentsService.remove(user.id, recipeId, commentId);
  }
}
