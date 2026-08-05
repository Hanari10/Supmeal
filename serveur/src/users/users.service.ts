import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../database/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

interface CreateUserData {
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
}

const publicUserSelect = {
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
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: publicUserSelect,
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    return user;
  }

  create(data: CreateUserData) {
    return this.prisma.user.create({
      data,
      select: publicUserSelect,
    });
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    await this.findProfile(userId);

    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName:
          updateProfileDto.firstName !== undefined
            ? updateProfileDto.firstName.trim() || null
            : undefined,

        lastName:
          updateProfileDto.lastName !== undefined
            ? updateProfileDto.lastName.trim() || null
            : undefined,

        defaultServings: updateProfileDto.defaultServings,

        dietaryPreferences: updateProfileDto.dietaryPreferences?.map((value) =>
          value.trim(),
        ),

        allergies: updateProfileDto.allergies?.map((value) => value.trim()),

        preferredCuisines: updateProfileDto.preferredCuisines?.map((value) =>
          value.trim(),
        ),
      },
      select: publicUserSelect,
    });
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user?.passwordHash) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    const currentPasswordIsValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.passwordHash,
    );

    if (!currentPasswordIsValid) {
      throw new UnauthorizedException('Le mot de passe actuel est incorrect.');
    }

    const passwordHash = await bcrypt.hash(changePasswordDto.newPassword, 12);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordHash,
      },
    });

    return {
      message: 'Mot de passe modifié avec succès.',
    };
  }
}
