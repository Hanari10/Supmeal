import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

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

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
        defaultServings: user.defaultServings,
        dietaryPreferences: user.dietaryPreferences,
        allergies: user.allergies,
        preferredCuisines: user.preferredCuisines,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}
