import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserModel } from '../../../common/models/user.model.js';

@ObjectType('Membership')
export class MembershipModel {
  @Field(() => ID)
  id: string;

  @Field(() => UserModel)
  user: UserModel;

  @Field()
  role: string;
}
