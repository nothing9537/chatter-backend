import { forwardRef, Module } from '@nestjs/common';

import { DbModule } from 'src/common/db/db.module';
import { CHAT_MODEL } from 'src/common/constants/injection-tokens';

import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { ChatsRepository } from './chats.repository';
import { MessagesModule } from './messages/messages.module';
import { ChatDocumentSchema } from './entities/chat.document';
import { ChatsController } from './chats.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    DbModule.forFeature([{ name: CHAT_MODEL, schema: ChatDocumentSchema }]),
    forwardRef(() => MessagesModule),
    UsersModule,
  ],
  providers: [ChatsResolver, ChatsService, ChatsRepository],
  exports: [ChatsRepository],
  controllers: [ChatsController],
})
export class ChatsModule { }
