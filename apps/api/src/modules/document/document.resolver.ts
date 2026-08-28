import {
  Args,
  ID,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserModel } from '../../common/models/user.model.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.js';
import { DocumentService } from './document.service.js';
import { CreateDocumentInput } from './dto/create-document.input.js';
import { UpdateDocumentInput } from './dto/update-document.input.js';
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

  @Mutation(() => DocumentModel)
  createDocument(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: CreateDocumentInput,
  ) {
    return this.documentService.create(user.orgId, user.id, input);
  }

  @Mutation(() => DocumentModel)
  updateDocument(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateDocumentInput,
  ) {
    return this.documentService.update(user.orgId, id, input);
  }

  @Mutation(() => DocumentModel)
  archiveDocument(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.documentService.setArchived(user.orgId, id, true);
  }

  @Mutation(() => DocumentModel)
  restoreDocument(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.documentService.setArchived(user.orgId, id, false);
  }

  @Mutation(() => Boolean)
  deleteDocument(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.documentService.remove(user.orgId, id);
  }

  @Mutation(() => DocumentModel)
  duplicateDocument(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.documentService.duplicate(user.orgId, user.id, id);
  }

  @Mutation(() => DocumentModel)
  moveDocument(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
    @Args('parentId', { type: () => String, nullable: true })
    parentId: string | null | undefined,
    @Args('position', { type: () => Int }) position: number,
  ) {
    return this.documentService.move(user.orgId, id, parentId, position);
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
