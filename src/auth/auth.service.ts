import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { User } from 'src/users/entities/user.entity';

import { TokenPayload } from './token-payload.interface';

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
      _id: user._id.toHexString(),
      email: user.email,
    };

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }
}
