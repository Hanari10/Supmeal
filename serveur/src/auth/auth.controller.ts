import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthenticatedUser } from './interfaces/authenticated-user.interface';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { GoogleUser } from './google.strategy';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Démarrer la connexion avec Google',
  })
  googleLogin(): void {
    // Passport redirige automatiquement vers Google.
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Callback OAuth2 Google',
  })
  async googleCallback(
    @Request() request: { user: GoogleUser },
    @Res() response: Response,
  ): Promise<void> {
    const result = await this.authService.loginWithGoogle(request.user);

    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ?? 'http://localhost:8080';

    response.redirect(
      `${frontendUrl}/oauth/callback#token=${encodeURIComponent(
        result.accessToken,
      )}`,
    );
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Récupérer l'utilisateur connecté",
  })
  @ApiOkResponse({
    description: "Informations de l'utilisateur connecté.",
  })
  @ApiUnauthorizedResponse({
    description: 'Jeton JWT absent ou invalide.',
  })
  getProfile(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }
}
