import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRecipeCommentDto {
  @ApiProperty({
    example: 'Très bonne recette, je recommande avec un peu plus de basilic.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content!: string;
}
