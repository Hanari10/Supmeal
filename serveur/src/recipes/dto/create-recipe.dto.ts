import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
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

  @ApiPropertyOptional({
    example: 'Une recette simple de crêpes.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({
    example: 15,
    description: 'Temps de préparation en minutes.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  preparationTime?: number;

  @ApiPropertyOptional({
    example: 20,
    description: 'Temps de cuisson en minutes.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  cookingTime?: number;

  @ApiPropertyOptional({
    example: 4,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  servings?: number;

  @ApiPropertyOptional({
    example: 'Facile',
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  difficulty?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/crepes.jpg',
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
