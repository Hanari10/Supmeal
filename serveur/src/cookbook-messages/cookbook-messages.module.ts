import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from '../database/prisma.module';
import { CookbookMessagesController } from './cookbook-messages.controller';
import { CookbookMessagesGateway } from './cookbook-messages.gateway';
import { CookbookMessagesService } from './cookbook-messages.service';

@Module({
  imports: [
    PrismaModule,

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
  ],

  controllers: [CookbookMessagesController],

  providers: [CookbookMessagesService, CookbookMessagesGateway],
})
export class CookbookMessagesModule {}
