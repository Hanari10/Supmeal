import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'test@supmeal.fr',
  })
  @IsEmail({}, { message: 'L’adresse email est invalide.' })
  email!: string;

  @ApiProperty({
    example: 'MotDePasse123!',
  })
  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères.',
  })
  @MaxLength(72, {
    message: 'Le mot de passe ne peut pas dépasser 72 caractères.',
  })
  password!: string;

  @ApiPropertyOptional({
    example: 'Aristhé',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Chaumartin',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;
}
