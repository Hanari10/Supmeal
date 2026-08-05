import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@ApiTags('Utilisateurs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Récupérer mon profil complet',
  })
  @ApiOkResponse({
    description: 'Profil récupéré.',
  })
  @Get('me')
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.findProfile(user.id);
  }

  @ApiOperation({
    summary: 'Modifier mon profil',
  })
  @ApiOkResponse({
    description: 'Profil modifié.',
  })
  @Patch('me')
  updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, updateProfileDto);
  }

  @ApiOperation({
    summary: 'Modifier mon mot de passe',
  })
  @ApiOkResponse({
    description: 'Mot de passe modifié.',
  })
  @ApiUnauthorizedResponse({
    description: 'Mot de passe actuel incorrect.',
  })
  @Patch('me/password')
  changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(user.id, changePasswordDto);
  }
}
