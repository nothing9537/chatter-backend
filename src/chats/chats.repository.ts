import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AbstractRepository } from 'src/common/db/abstract.repository';

import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatsRepository extends AbstractRepository<Chat> {
  protected readonly logger: Logger = new Logger(ChatsRepository.name);

  constructor(@InjectModel(Chat.name) chatModel: Model<Chat>) {
    super(chatModel);
  }
}
