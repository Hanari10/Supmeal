import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCookbookDto {
  @ApiProperty({
    example: 'Recettes familiales',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
