import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateRecipeCommentDto {
  @ApiPropertyOptional({
    example: 'Commentaire modifié.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content?: string;
}
