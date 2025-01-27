import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { AbstractEntity } from 'src/common/db/abstract.entity';

@Schema({ versionKey: false })
export class UserDocument extends AbstractEntity {
  @Prop({ unique: true })
  email: string;

  @Prop()
  username: string;

  @Prop()
  password: string;
}

export const UserDocumentSchema = SchemaFactory.createForClass(UserDocument);
