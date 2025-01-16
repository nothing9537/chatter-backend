import { Module } from '@nestjs/common';

import { DbModule } from 'src/common/db/db.module';

import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { UsersRepository } from './users.repository';
import { User, UserSchema } from './entities/user.entity';

@Module({
  imports: [DbModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UsersResolver, UsersService, UsersRepository],
})
export class UsersModule {}
