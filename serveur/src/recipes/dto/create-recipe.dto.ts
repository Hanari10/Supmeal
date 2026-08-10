import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateRecipeDto {
  @ApiProperty({
    example: 'Crêpes',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    example: 'Une recette simple de crêpes.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    example: 'Mélanger les ingrédients puis cuire les crêpes.',
  })
  @IsString()
  instructions!: string;

  @ApiProperty({
    example: 4,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  servings?: number;

  @ApiProperty({
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  preparationTime?: number;

  @ApiProperty({
    example: 15,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  cookingTime?: number;

  @ApiProperty({
    example: 'Facile',
    required: false,
  })
  @IsOptional()
  @IsString()
  difficulty?: string;

  @ApiProperty({
    example: '/uploads/recipes/crepes.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string;

  @ApiProperty({
    example: 'https://exemple.com/recette-crepes',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  sourceUrl?: string;

  @ApiProperty({
    example: ['Dessert', 'Rapide'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
