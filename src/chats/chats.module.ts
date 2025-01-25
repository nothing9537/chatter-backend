import { forwardRef, Module } from '@nestjs/common';

import { DbModule } from 'src/common/db/db.module';

import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { Chat, ChatSchema } from './entities/chat.entity';
import { ChatsRepository } from './chats.repository';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    DbModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    forwardRef(() => MessagesModule),
  ],
  providers: [ChatsResolver, ChatsService, ChatsRepository],
  exports: [ChatsRepository],
})
export class ChatsModule {}
