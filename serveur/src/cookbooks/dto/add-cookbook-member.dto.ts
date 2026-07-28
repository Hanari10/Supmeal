import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn } from 'class-validator';

export class AddCookbookMemberDto {
  @ApiProperty({
    example: 'membre@email.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'EDITOR',
    enum: ['EDITOR', 'READER', 'COMMENTER'],
  })
  @IsIn(['EDITOR', 'READER', 'COMMENTER'])
  role!: string;
}
