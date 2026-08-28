import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { JsonScalar } from '../../../common/scalars/json.scalar.js';
import { UserModel } from '../../../common/models/user.model.js';

@ObjectType('DocumentVersion')
export class DocumentVersionModel {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  version: number;

  @Field()
  title: string;

  @Field(() => JsonScalar)
  content: unknown;

  @Field(() => UserModel)
  createdBy: UserModel;

  @Field()
  createdAt: Date;
}
