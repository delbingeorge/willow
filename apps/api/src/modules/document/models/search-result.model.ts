import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('SearchResult')
export class SearchResultModel {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field(() => String, { nullable: true })
  icon: string | null;

  @Field(() => String, { nullable: true })
  snippet: string | null;

  @Field()
  updatedAt: Date;
}
