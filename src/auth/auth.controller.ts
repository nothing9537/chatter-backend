import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { User } from 'src/users/entities/user.entity';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  public async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response);
  }

  @Post('logout')
  public async logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }
}
