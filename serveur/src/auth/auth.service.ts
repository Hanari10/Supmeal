import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

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
}
