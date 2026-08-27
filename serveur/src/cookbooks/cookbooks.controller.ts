import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CookbooksService } from './cookbooks.service';
import { AddCookbookMemberDto } from './dto/add-cookbook-member.dto';
import { AddCookbookRecipeDto } from './dto/add-cookbook-recipe.dto';
import { CreateCookbookDto } from './dto/create-cookbook.dto';
import { UpdateCookbookDto } from './dto/update-cookbook.dto';

@ApiTags('Cookbooks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cookbooks')
export class CookbooksController {
  constructor(private readonly cookbooksService: CookbooksService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un cookbook' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createCookbookDto: CreateCookbookDto,
  ) {
    return this.cookbooksService.create(user.id, createCookbookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer mes cookbooks' })
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.cookbooksService.findAll(user.id);
  }

  @Get(':id/recipes/search')
  @ApiOperation({ summary: 'Rechercher des recettes dans un cookbook' })
  searchRecipes(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Query('query') query?: string,
  ) {
    return this.cookbooksService.searchRecipes(user.id, id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un cookbook' })
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.cookbooksService.findOne(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un cookbook' })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateCookbookDto: UpdateCookbookDto,
  ) {
    return this.cookbooksService.update(user.id, id, updateCookbookDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un cookbook' })
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.cookbooksService.remove(user.id, id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Ajouter un membre au cookbook' })
  addMember(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() addCookbookMemberDto: AddCookbookMemberDto,
  ) {
    return this.cookbooksService.addMember(user.id, id, addCookbookMemberDto);
  }

  @Delete(':id/members/:memberId')
  @ApiOperation({ summary: 'Supprimer un membre du cookbook' })
  removeMember(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ) {
    return this.cookbooksService.removeMember(user.id, id, memberId);
  }

  @Post(':id/recipes')
  @ApiOperation({ summary: 'Ajouter une recette au cookbook' })
  addRecipe(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() addCookbookRecipeDto: AddCookbookRecipeDto,
  ) {
    return this.cookbooksService.addRecipe(
      user.id,
      id,
      addCookbookRecipeDto.recipeId,
    );
  }

  @Delete(':id/recipes/:recipeId')
  @ApiOperation({ summary: 'Retirer une recette du cookbook' })
  removeRecipe(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Param('recipeId') recipeId: string,
  ) {
    return this.cookbooksService.removeRecipe(user.id, id, recipeId);
  }
}
