import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class SearchRecipesDto {
  @ApiPropertyOptional({
    description: 'Recherche dans le titre, la description et les instructions',
  })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({
    description: 'Tag recherché',
  })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({
    description: 'Difficulté recherchée',
  })
  @IsOptional()
  @IsString()
  difficulty?: string;

  @ApiPropertyOptional({
    description: 'Temps maximal de préparation en minutes',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPreparationTime?: number;

  @ApiPropertyOptional({
    description: 'Temps maximal de cuisson en minutes',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxCookingTime?: number;

  @ApiPropertyOptional({
    description: "Nom de l'ingrédient recherché",
    example: 'tomate',
  })
  @IsOptional()
  @IsString()
  ingredient?: string;

  @ApiPropertyOptional({
    description: 'Identifiant du cookbook',
  })
  @IsOptional()
  @IsString()
  cookbookId?: string;

  @ApiPropertyOptional({
    description: 'Limiter la recherche aux recettes favorites',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  favorite?: boolean;
}
