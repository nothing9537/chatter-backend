import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { AbstractEntity } from 'src/common/db/abstract.entity';

import { Message } from '../messages/entities/message.entity';

@Schema()
export class ChatDocument extends AbstractEntity {
  @Prop()
  userId: string;

  // @Prop()
  // isPrivate: boolean;

  @Prop()
  name?: string;

  // @Prop([String])
  // userIds: string[];

  @Prop([Message])
  messages: Message[];
}

export const ChatDocumentSchema = SchemaFactory.createForClass(ChatDocument);
