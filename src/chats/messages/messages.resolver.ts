import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';

import { PubSub } from 'graphql-subscriptions';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { PUB_SUB } from 'src/common/constants/injection-tokens';

import { CreateMessageInput } from './dto/create-message.input';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { GetMessagesArgs } from './dto/get-messages.args';
import { MESSAGE_CREATED } from './constants/pubsub-triggers';
import { MessageCreatedArgs } from './dto/message-created.args';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(
    private readonly messagesService: MessagesService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  public async createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.messagesService.createMessage(createMessageInput, user._id);
  }

  @Query(() => [Message], { name: 'messages' })
  @UseGuards(GqlAuthGuard)
  public async getMessages(
    @Args() getMessagesArgs: GetMessagesArgs,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.messagesService.getMessages(getMessagesArgs, user._id);
  }

  @Subscription(() => Message, {
    filter: (payload, variables) => {
      return payload.messageCreated.chatId === variables.chatId;
    },
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async messageCreated(@Args() _messageCreatedArgs: MessageCreatedArgs) {
    return this.pubSub.asyncIterableIterator(MESSAGE_CREATED);
  }
}
