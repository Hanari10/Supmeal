import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateShoppingListItemDto {
  @ApiProperty({
    description: "Identifiant de l'ingrédient",
  })
  @IsUUID()
  ingredientId!: string;

  @ApiProperty({
    description: 'Quantité à acheter',
    example: 2,
  })
  @IsNumber()
  @IsPositive()
  quantity!: number;

  @ApiPropertyOptional({
    description: 'Unité de mesure',
    example: 'kg',
  })
  @IsOptional()
  @IsString()
  unit?: string;
}
