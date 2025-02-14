import { Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { PubSub } from 'graphql-subscriptions';

import { PUB_SUB } from 'src/common/constants/injection-tokens';
import { UsersService } from 'src/users/users.service';

import { CreateMessageInput } from './dto/create-message.input';
import { MessageDocument } from './entities/message.document';
import { ChatsRepository } from '../chats.repository';
import { GetMessagesArgs } from './dto/get-messages.args';
import { MESSAGE_CREATED } from './constants/pubsub-triggers';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly usersService: UsersService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  public async createMessage(
    { content, chatId }: CreateMessageInput,
    userId: string,
  ) {
    const messageDocument: MessageDocument = {
      content,
      userId: new Types.ObjectId(userId),
      createdAt: new Date(),
      _id: new Types.ObjectId(),
    };

    await this.chatsRepository.findOneAndUpdate(
      {
        _id: chatId,
      },
      {
        $push: {
          messages: messageDocument,
        },
      },
    );

    const message: Message = {
      ...messageDocument,
      chatId,
      user: await this.usersService.findOne(userId),
    };

    await this.pubSub.publish(MESSAGE_CREATED, {
      messageCreated: message,
    });

    return message;
  }

  public async getMessages({ chatId, skip, limit }: GetMessagesArgs) {
    const messages = await this.chatsRepository.model.aggregate([
      { $match: { _id: new Types.ObjectId(chatId) } },
      { $unwind: '$messages' },
      { $replaceRoot: { newRoot: '$messages' } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $unset: 'userId' },
      { $set: { chatId } },
    ]);

    for (const message of messages) {
      message.user = this.usersService.transformToUserEntity(message.user);
    }

    return messages;
  }

  public async messageCreated() {
    return this.pubSub.asyncIterableIterator(MESSAGE_CREATED);
  }

  public async countMessages(chatId: string) {
    const chatMessages = await this.chatsRepository.model.aggregate([
      { $match: { _id: new Types.ObjectId(chatId) } },
      { $unwind: '$messages' },
      { $count: 'message' },
    ]);

    const count = chatMessages[0]?.message || 0;

    return count;
  }
}
