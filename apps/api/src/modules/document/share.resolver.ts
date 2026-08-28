import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.js';
import { DocumentShareModel } from './models/document-share.model.js';
import { ShareService } from './share.service.js';

@Resolver(() => DocumentShareModel)
export class ShareResolver {
  constructor(private readonly shareService: ShareService) {}

  @Mutation(() => DocumentShareModel)
  shareDocument(
    @CurrentUser() user: AuthenticatedUser,
    @Args('documentId', { type: () => ID }) documentId: string,
    @Args('userId', { type: () => ID }) userId: string,
    @Args('role') role: string,
  ) {
    return this.shareService.share(user.orgId, documentId, userId, role);
  }

  @Mutation(() => DocumentShareModel)
  updateShare(
    @CurrentUser() user: AuthenticatedUser,
    @Args('shareId', { type: () => ID }) shareId: string,
    @Args('role') role: string,
  ) {
    return this.shareService.updateRole(user.orgId, shareId, role);
  }

  @Mutation(() => Boolean)
  removeShare(@CurrentUser() user: AuthenticatedUser, @Args('shareId', { type: () => ID }) shareId: string) {
    return this.shareService.remove(user.orgId, shareId);
  }
}
