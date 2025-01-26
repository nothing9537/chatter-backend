import { forwardRef, Module } from '@nestjs/common';

import { UsersModule } from 'src/users/users.module';

import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { ChatsModule } from '../chats.module';

@Module({
  imports: [forwardRef(() => ChatsModule), UsersModule],
  providers: [MessagesResolver, MessagesService],
})
export class MessagesModule {}
