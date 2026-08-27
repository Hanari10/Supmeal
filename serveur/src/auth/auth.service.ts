import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { GoogleUser } from './google.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const email = registerDto.email.trim().toLowerCase();

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException(
        'Un compte existe déjà avec cette adresse email.',
      );
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 12);

    return this.usersService.create({
      email,
      passwordHash,
      firstName: registerDto.firstName?.trim(),
      lastName: registerDto.lastName?.trim(),
    });
  }

  async login(loginDto: LoginDto) {
    const email = loginDto.email.trim().toLowerCase();

    const user = await this.usersService.findByEmail(email);

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException(
        'Adresse email ou mot de passe incorrect.',
      );
    }

    const passwordIsValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException(
        'Adresse email ou mot de passe incorrect.',
      );
    }

    return this.createSession(user.id);
  }

  async loginWithGoogle(googleUser: GoogleUser) {
    const existingOAuthAccount = await this.usersService.findOAuthAccount(
      googleUser.provider,
      googleUser.providerAccountId,
    );

    if (existingOAuthAccount) {
      return this.createSession(existingOAuthAccount.userId);
    }

    const existingUser = await this.usersService.findByEmail(googleUser.email);

    if (existingUser) {
      await this.usersService.linkOAuthAccount(
        existingUser.id,
        googleUser.provider,
        googleUser.providerAccountId,
      );

      return this.createSession(existingUser.id);
    }

    const user = await this.usersService.createOAuthUser({
      email: googleUser.email,
      firstName: googleUser.firstName,
      lastName: googleUser.lastName,
      profileImage: googleUser.profileImage,
      provider: googleUser.provider,
      providerAccountId: googleUser.providerAccountId,
    });

    return this.createSession(user.id);
  }

  private async createSession(userId: string) {
    const user = await this.usersService.findProfile(userId);

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken,
      user,
    };
  }
}
