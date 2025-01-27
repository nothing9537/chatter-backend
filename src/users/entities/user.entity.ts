import { Field, ObjectType } from '@nestjs/graphql';

import { AbstractEntity } from 'src/common/db/abstract.entity';

@ObjectType()
export class User extends AbstractEntity {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  imageUrl: string;
}
