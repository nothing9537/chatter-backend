import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AbstractRepository } from 'src/common/db/abstract.repository';

import { ChatDocument } from './entities/chat.document';

@Injectable()
export class ChatsRepository extends AbstractRepository<ChatDocument> {
  protected readonly logger: Logger = new Logger(ChatsRepository.name);

  constructor(@InjectModel(ChatDocument.name) chatModel: Model<ChatDocument>) {
    super(chatModel);
  }
}
