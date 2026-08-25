import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCookbookMessageDto {
  @ApiProperty({
    example: 'Qui veut préparer les lasagnes demain soir ?',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content!: string;
}
