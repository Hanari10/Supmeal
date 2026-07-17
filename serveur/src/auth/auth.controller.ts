import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Créer un nouveau compte utilisateur',
  })
  @ApiCreatedResponse({
    description: 'Utilisateur créé avec succès.',
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Connecter un utilisateur',
  })
  @ApiOkResponse({
    description: 'Connexion réussie et jeton JWT généré.',
  })
  @ApiUnauthorizedResponse({
    description: 'Adresse email ou mot de passe incorrect.',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
