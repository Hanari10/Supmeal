import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'AncienMotDePasse123!',
  })
  @IsString()
  currentPassword!: string;

  @ApiProperty({
    example: 'NouveauMotDePasse123!',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  newPassword!: string;
}
