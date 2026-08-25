import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCookbookMessageDto {
  @ApiPropertyOptional({
    example: 'Qui veut préparer les lasagnes samedi soir ?',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content?: string;
}
