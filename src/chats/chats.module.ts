import { forwardRef, Module } from '@nestjs/common';

import { DbModule } from 'src/common/db/db.module';

import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { ChatsRepository } from './chats.repository';
import { MessagesModule } from './messages/messages.module';
import { ChatDocument, ChatDocumentSchema } from './entities/chat.document';

@Module({
  imports: [
    DbModule.forFeature([
      { name: ChatDocument.name, schema: ChatDocumentSchema },
    ]),
    forwardRef(() => MessagesModule),
  ],
  providers: [ChatsResolver, ChatsService, ChatsRepository],
  exports: [ChatsRepository],
})
export class ChatsModule {}
