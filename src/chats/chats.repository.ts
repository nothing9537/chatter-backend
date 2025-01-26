import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AbstractRepository } from 'src/common/db/abstract.repository';
import { CHAT_MODEL } from 'src/common/constants/injection-tokens';

import { ChatDocument } from './entities/chat.document';

@Injectable()
export class ChatsRepository extends AbstractRepository<ChatDocument> {
  protected readonly logger: Logger = new Logger(ChatsRepository.name);

  constructor(@InjectModel(CHAT_MODEL) chatModel: Model<ChatDocument>) {
    super(chatModel);
  }
}
