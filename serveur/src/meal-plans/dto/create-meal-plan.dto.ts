import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MealType, WeekDay } from '../../generated/prisma/enums';
import { IsEnum, IsInt, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class CreateMealPlanDto {
  @ApiProperty({
    description: 'Identifiant de la recette',
  })
  @IsUUID()
  recipeId!: string;

  @ApiProperty({
    enum: WeekDay,
  })
  @IsEnum(WeekDay)
  day!: WeekDay;

  @ApiProperty({
    enum: MealType,
  })
  @IsEnum(MealType)
  mealType!: MealType;

  @ApiPropertyOptional({
    description: 'Nombre de portions prévues',
    example: 4,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  servings?: number;
}
