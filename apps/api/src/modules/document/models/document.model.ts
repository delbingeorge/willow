import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { UserModel } from '../../../common/models/user.model.js';
import { DocumentShareModel } from './document-share.model.js';
import { DocumentVersionModel } from './document-version.model.js';

@ObjectType('Document')
export class DocumentModel {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field(() => String, { nullable: true })
  icon: string | null;

  @Field(() => String, { nullable: true })
  coverUrl: string | null;

  @Field(() => String, { nullable: true })
  parentId: string | null;

  @Field(() => Int)
  position: number;

  @Field()
  isArchived: boolean;

  @Field()
  isPublished: boolean;

  @Field(() => UserModel)
  createdBy: UserModel;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [DocumentModel])
  children: DocumentModel[];

  @Field(() => Int)
  childCount: number;

  @Field(() => [DocumentVersionModel])
  versions: DocumentVersionModel[];

  @Field(() => Int)
  currentVersion: number;

  @Field(() => [DocumentShareModel])
  shares: DocumentShareModel[];

  @Field(() => String, { nullable: true })
  shareLink: string | null;
}
