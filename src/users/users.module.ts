import { Module } from '@nestjs/common';

import { DbModule } from 'src/common/db/db.module';
import { S3Module } from 'src/common/s3/s3.module';

import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UserDocumentSchema } from './entities/user.document';

@Module({
  imports: [
    DbModule.forFeature([{ name: User.name, schema: UserDocumentSchema }]),
    S3Module,
  ],
  providers: [UsersResolver, UsersService, UsersRepository],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
