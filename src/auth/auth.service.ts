import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

import { User } from 'src/users/entities/user.entity';

import { TokenPayload } from './token-payload.interface';
import { extractJwt } from './utils/extract-jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async login(user: User, response: Response) {
    const expires = new Date();
    const expiresSeconds = +this.configService.getOrThrow('JWT_EXPIRATION');

    expires.setSeconds(expires.getSeconds() + expiresSeconds);

    const tokenPayload: TokenPayload = {
      ...user,
      _id: user._id.toHexString(),
    };

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      httpOnly: true,
      domain: this.configService.get('WEB_DOMAIN'),
      expires,
      secure: true,
      sameSite: 'none',
    });

    return token;
  }

  public async logout(response: Response) {
    response.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(),
    });

    return { success: true };
  }

  public verifyWs(
    request: Request,
    connectionParams: Readonly<Record<string, unknown>> = {},
  ): TokenPayload {
    const cookies: string[] = request.headers?.cookie?.split?.('; ');
    const authCookie = cookies?.find?.((cookie) =>
      cookie.includes('Authentication'),
    );

    const jwt =
      authCookie?.split?.('=')?.[1] ||
      extractJwt(connectionParams?.token as string);

    return this.jwtService.verify(jwt);
  }
}
