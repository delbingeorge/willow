import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserModel } from '../../../common/models/user.model.js';

@ObjectType('DocumentShare')
export class DocumentShareModel {
  @Field(() => ID)
  id: string;

  @Field(() => UserModel, { nullable: true })
  user: UserModel | null;

  @Field()
  role: string;

  @Field(() => String, { nullable: true })
  token: string | null;

  @Field()
  createdAt: Date;
}
