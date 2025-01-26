import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { TokenPayload } from 'src/auth/token-payload.interface';

import { CreateMessageInput } from './dto/create-message.input';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { GetMessagesArgs } from './dto/get-messages.args';
import { MessageCreatedArgs } from './dto/message-created.args';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) { }

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  public async createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
    @CurrentUser() user: TokenPayload,
  ): Promise<Message> {
    return this.messagesService.createMessage(createMessageInput, user._id);
  }

  @Query(() => [Message], { name: 'messages' })
  @UseGuards(GqlAuthGuard)
  public async getMessages(
    @Args() getMessagesArgs: GetMessagesArgs,
  ): Promise<Message[]> {
    return this.messagesService.getMessages(getMessagesArgs);
  }

  @Subscription(() => Message, {
    filter: (payload, variables, context) => {
      const userId = context.req.user._id as string;
      const message: Message = payload.messageCreated;

      return (
        message.chatId === variables.chatId &&
        userId !== message.user._id.toHexString()
      );
    },
  })
  public async messageCreated(@Args() messageCreatedArgs: MessageCreatedArgs) {
    return this.messagesService.messageCreated(messageCreatedArgs);
  }
}
