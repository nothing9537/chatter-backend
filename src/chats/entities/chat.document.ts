import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { AbstractEntity } from 'src/common/db/abstract.entity';

import { MessageDocument } from '../messages/entities/message.document';

@Schema()
export class ChatDocument extends AbstractEntity {
  @Prop()
  userId: string;

  @Prop()
  name: string;

  @Prop([MessageDocument])
  messages: MessageDocument[];
}

export const ChatDocumentSchema = SchemaFactory.createForClass(ChatDocument);
