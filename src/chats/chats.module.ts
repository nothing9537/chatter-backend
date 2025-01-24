import { Module } from '@nestjs/common';

import { DbModule } from 'src/common/db/db.module';

import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { Chat, ChatSchema } from './entities/chat.entity';
import { ChatsRepository } from './chats.repository';

@Module({
  imports: [DbModule.forFeature([{ name: Chat.name, schema: ChatSchema }])],
  providers: [ChatsResolver, ChatsService, ChatsRepository],
})
export class ChatsModule {}
