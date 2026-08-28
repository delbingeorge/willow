import {
  Args,
  ID,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserModel } from '../../common/models/user.model.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.js';
import { DocumentService } from './document.service.js';
import { DocumentModel } from './models/document.model.js';

@Resolver(() => DocumentModel)
export class DocumentResolver {
  constructor(private readonly documentService: DocumentService) {}

  @Query(() => [DocumentModel])
  documents(
    @CurrentUser() user: AuthenticatedUser,
    @Args('parentId', { type: () => String, nullable: true })
    parentId?: string | null,
    @Args('isArchived', { type: () => Boolean, nullable: true })
    isArchived?: boolean,
  ) {
    return this.documentService.findMany(user.orgId, { parentId, isArchived });
  }

  @Query(() => DocumentModel)
  document(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.documentService.findOne(user.orgId, id);
  }

  @Query(() => [DocumentModel])
  documentTree(@CurrentUser() user: AuthenticatedUser) {
    return this.documentService.findTree(user.orgId);
  }

  @ResolveField('createdBy', () => UserModel)
  createdBy(@Parent() document: { creator: UserModel }) {
    return document.creator;
  }

  @ResolveField('children', () => [DocumentModel])
  children(@Parent() document: { id: string }) {
    return this.documentService.findChildren(document.id);
  }

  @ResolveField('childCount', () => Int)
  childCount(@Parent() document: { id: string }) {
    return this.documentService.countChildren(document.id);
  }
}
