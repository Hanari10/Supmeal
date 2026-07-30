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
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MealPlansService } from './meal-plans.service';
import { CreateMealPlanDto } from './dto/create-meal-plan.dto';
import { UpdateMealPlanDto } from './dto/update-meal-plan.dto';

@ApiTags('meal-plans')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('meal-plans')
export class MealPlansController {
  constructor(private readonly mealPlansService: MealPlansService) {}

  @ApiOperation({
    summary: 'Ajouter un repas au planning',
  })
  @ApiCreatedResponse({
    description: 'Repas ajouté.',
  })
  @ApiConflictResponse({
    description: 'Un repas existe déjà sur ce créneau.',
  })
  @Post()
  create(
    @Request() request: { user: { id: string; email: string } },
    @Body() dto: CreateMealPlanDto,
  ) {
    return this.mealPlansService.create(request.user.id, dto);
  }

  @ApiOperation({
    summary: 'Récupérer mon planning',
  })
  @ApiOkResponse({
    description: 'Planning récupéré.',
  })
  @Get()
  findAll(@Request() request: { user: { id: string; email: string } }) {
    return this.mealPlansService.findAll(request.user.id);
  }

  @ApiOperation({
    summary: 'Modifier un repas',
  })
  @ApiNotFoundResponse({
    description: 'Repas introuvable.',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() request: { user: { id: string; email: string } },
    @Body() dto: UpdateMealPlanDto,
  ) {
    return this.mealPlansService.update(id, request.user.id, dto);
  }

  @ApiOperation({
    summary: 'Supprimer un repas',
  })
  @ApiNotFoundResponse({
    description: 'Repas introuvable.',
  })
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() request: { user: { id: string; email: string } },
  ) {
    return this.mealPlansService.remove(id, request.user.id);
  }
}
