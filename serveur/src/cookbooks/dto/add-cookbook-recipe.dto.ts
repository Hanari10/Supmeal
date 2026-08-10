import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddCookbookRecipeDto {
  @ApiProperty({
    example: 'cm123456789',
  })
  @IsString()
  @IsNotEmpty()
  recipeId!: string;
}
