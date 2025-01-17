import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { User } from 'src/users/entities/user.entity';

import { LocalAuthGuard } from './guards/local-auth-guard';
import { CurrentUser } from './current-user.decorator';

@Controller('auth')
export class AuthController {
  @Post('login')
  @UseGuards(LocalAuthGuard)
  public async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    
  }
}
