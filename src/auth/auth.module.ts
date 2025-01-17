import { Module } from '@nestjs/common';

import { UsersModule } from 'src/users/users.module';

import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local-strategy';

@Module({
  imports: [UsersModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
