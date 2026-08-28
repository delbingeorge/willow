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
import { DocumentShareModel } from './models/document-share.model.js';
import { DocumentVersionModel } from './models/document-version.model.js';
import { SearchResultModel } from './models/search-result.model.js';
import { ShareService } from './share.service.js';
import { VersionService } from './version.service.js';

@Resolver(() => DocumentModel)
export class DocumentResolver {
  constructor(
    private readonly documentService: DocumentService,
    private readonly shareService: ShareService,
    private readonly versionService: VersionService,
  ) {}

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

  @Query(() => [SearchResultModel])
  search(@CurrentUser() user: AuthenticatedUser, @Args('query') query: string) {
    return this.documentService.search(user.orgId, query);
  }

  @Mutation(() => Boolean)
  importDocumentState(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
    @Args('state') state: string,
  ) {
    return this.documentService.importState(user.orgId, id, state);
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

  @Mutation(() => DocumentVersionModel)
  createVersion(
    @CurrentUser() user: AuthenticatedUser,
    @Args('documentId', { type: () => ID }) documentId: string,
  ) {
    return this.versionService.create(user.orgId, user.id, documentId);
  }

  @Mutation(() => DocumentModel)
  publishDocument(
    @CurrentUser() user: AuthenticatedUser,
    @Args('documentId', { type: () => ID }) documentId: string,
  ) {
    return this.shareService.publish(user.orgId, documentId);
  }

  @Mutation(() => DocumentModel)
  unpublishDocument(
    @CurrentUser() user: AuthenticatedUser,
    @Args('documentId', { type: () => ID }) documentId: string,
  ) {
    return this.shareService.unpublish(user.orgId, documentId);
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

  @ResolveField('versions', () => [DocumentVersionModel])
  versions(
    @Parent() document: { id: string },
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
  ) {
    return this.versionService.findMany(document.id, limit, offset);
  }

  @ResolveField('currentVersion', () => Int)
  currentVersion(@Parent() document: { id: string }) {
    return this.versionService.currentVersion(document.id);
  }

  @ResolveField('shares', () => [DocumentShareModel])
  shares(@Parent() document: { id: string }) {
    return this.shareService.findByDocument(document.id);
  }

  @ResolveField('shareLink', () => String, { nullable: true })
  async shareLink(@Parent() document: { id: string; isPublished: boolean }) {
    if (!document.isPublished) {
      return null;
    }

    const share = await this.shareService.findPublicShare(document.id);
    return share?.token ? `/shared/${share.token}` : null;
  }
}
