import { Args, ID, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.js';
import { MembershipModel } from './models/membership.model.js';
import { OrganizationModel } from './models/organization.model.js';
import { OrganizationService } from './organization.service.js';

@Resolver(() => OrganizationModel)
export class OrganizationResolver {
  constructor(private readonly organizationService: OrganizationService) {}

  @Query(() => OrganizationModel)
  organization(@CurrentUser() user: AuthenticatedUser) {
    return this.organizationService.findOne(user.orgId);
  }

  @Mutation(() => OrganizationModel)
  updateOrganization(@CurrentUser() user: AuthenticatedUser, @Args('name') name: string) {
    return this.organizationService.update(user.orgId, name);
  }

  @Mutation(() => MembershipModel)
  inviteMember(
    @CurrentUser() user: AuthenticatedUser,
    @Args('email') email: string,
    @Args('role') role: string,
  ) {
    return this.organizationService.inviteMember(user.orgId, email, role);
  }

  @Mutation(() => MembershipModel)
  updateMemberRole(
    @CurrentUser() user: AuthenticatedUser,
    @Args('membershipId', { type: () => ID }) membershipId: string,
    @Args('role') role: string,
  ) {
    return this.organizationService.updateMemberRole(user.orgId, membershipId, role);
  }

  @Mutation(() => Boolean)
  removeMember(
    @CurrentUser() user: AuthenticatedUser,
    @Args('membershipId', { type: () => ID }) membershipId: string,
  ) {
    return this.organizationService.removeMember(user.orgId, membershipId);
  }

  @ResolveField('members', () => [MembershipModel])
  members(@Parent() organization: { id: string }) {
    return this.organizationService.findMembers(organization.id);
  }

  @ResolveField('memberCount', () => Int)
  memberCount(@Parent() organization: { id: string }) {
    return this.organizationService.countMembers(organization.id);
  }
}
