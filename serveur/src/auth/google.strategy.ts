import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

export interface GoogleUser {
  provider: 'google';
  providerAccountId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): void {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      done(new Error("Le compte Google ne fournit pas d'adresse email."));
      return;
    }

    const googleUser: GoogleUser = {
      provider: 'google',
      providerAccountId: profile.id,
      email: email.trim().toLowerCase(),
      firstName: profile.name?.givenName,
      lastName: profile.name?.familyName,
      profileImage: profile.photos?.[0]?.value,
    };

    done(null, googleUser);
  }
}
