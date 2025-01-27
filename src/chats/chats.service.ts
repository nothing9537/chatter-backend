import { Injectable, NotFoundException } from '@nestjs/common';
import { PipelineStage, Types } from 'mongoose';

import { PaginationArgs } from 'src/common/dto/pagination-args';

import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { ChatsRepository } from './chats.repository';

@Injectable()
export class ChatsService {
  constructor(private readonly chatsRepository: ChatsRepository) {}

  public async create(createChatInput: CreateChatInput, userId: string) {
    return this.chatsRepository.create({
      ...createChatInput,
      userId,
      messages: [],
    });
  }

  public async findMany(
    prePipelineStages: PipelineStage[] = [],
    paginationArgs?: PaginationArgs,
  ) {
    const paginationPipelineStages: PipelineStage[] = paginationArgs
      ? [
          { $skip: paginationArgs?.skip || 0 },
          { $limit: paginationArgs?.limit },
        ]
      : [];

    const chats = await this.chatsRepository.model.aggregate([
      ...prePipelineStages,
      {
        $set: {
          latestMessage: {
            $cond: [
              '$messages',
              { $arrayElemAt: ['$messages', -1] },
              { createdAt: new Date() },
            ],
          },
        },
      },
      { $sort: { 'latestMessage.createdAt': -1 } },
      ...paginationPipelineStages,
      { $unset: 'messages' },
      {
        $lookup: {
          from: 'users',
          localField: 'latestMessage.userId',
          foreignField: '_id',
          as: 'latestMessage.user',
        },
      },
    ]);

    chats.forEach((chat) => {
      if (!chat.latestMessage?._id) {
        delete chat.latestMessage;
        return;
      }

      chat.latestMessage.user = chat.latestMessage.user[0];
      delete chat.latestMessage.userId;
      delete chat.latestMessage.user.password;
      chat.latestMessage.chatId = chat._id;
    });

    return chats;
  }

  public async findOne(_id: string) {
    const chats = await this.findMany([
      { $match: { _id: new Types.ObjectId(_id) } },
    ]);

    const chat = chats[0];

    if (!chat) {
      throw new NotFoundException(`No chat was found with ID ${_id}`);
    }

    return chat;
  }

  public async countChats() {
    return await this.chatsRepository.model.countDocuments({});
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, _updateChatInput: UpdateChatInput) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
