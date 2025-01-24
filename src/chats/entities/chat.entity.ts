import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { AbstractEntity } from 'src/common/db/abstract.entity';
import { Message } from '../messages/entities/message.entity';

@ObjectType()
@Schema()
export class Chat extends AbstractEntity {
  @Field()
  @Prop()
  userId: string;

  @Field()
  @Prop()
  isPrivate: boolean;

  @Field({ nullable: true })
  @Prop()
  name?: string;

  @Field(() => [String])
  @Prop([String])
  userIds: string[];

  @Prop([Message])
  messages: Message[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
