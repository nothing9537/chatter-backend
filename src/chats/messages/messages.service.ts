import { Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { CreateMessageInput } from './dto/create-message.input';
import { ChatsRepository } from '../chats.repository';
import { Message } from './entities/message.entity';
import { GetMessagesArgs } from './dto/get-messages.args';
import { PUB_SUB } from 'src/common/constants/injection-tokens';
import { PubSub } from 'graphql-subscriptions';
import { MESSAGE_CREATED } from './constants/pubsub-triggers';

@Injectable()
export class MessagesService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  public async createMessage(
    { content, chatId }: CreateMessageInput,
    userId: string,
  ) {
    const message: Message = {
      content,
      userId,
      createdAt: new Date(),
      chatId,
      _id: new Types.ObjectId(),
    };

    await this.chatsRepository.findOneAndUpdate(
      {
        _id: chatId,
        ...this.userChatFilter(userId),
      },
      {
        $push: {
          messages: message,
        },
      },
    );

    await this.pubSub.publish(MESSAGE_CREATED, {
      messageCreated: message,
    });

    return message;
  }

  public async getMessages({ chatId }: GetMessagesArgs, userId: string) {
    return (
      await this.chatsRepository.findOne({
        _id: chatId,
        ...this.userChatFilter(userId),
      })
    ).messages;
  }

  private userChatFilter(userId: string) {
    return {
      $or: [
        { userId },
        {
          userIds: {
            $in: [userId],
          },
        },
      ],
    };
  }
}
