import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { MembershipModel } from './membership.model.js';

@ObjectType('Organization')
export class OrganizationModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field()
  plan: string;

  @Field(() => [MembershipModel])
  members: MembershipModel[];

  @Field(() => Int)
  memberCount: number;
}
