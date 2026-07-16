import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

interface CreateUserData {
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  create(data: CreateUserData) {
    return this.prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profileImage: true,
        defaultServings: true,
        dietaryPreferences: true,
        allergies: true,
        preferredCuisines: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
