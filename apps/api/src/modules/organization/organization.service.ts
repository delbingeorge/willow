import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

const MAX_NAME_LENGTH = 100;
const VALID_ROLES = ['owner', 'admin', 'member', 'viewer'];

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(orgId: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: orgId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async update(orgId: string, name: string) {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > MAX_NAME_LENGTH) {
      throw new BadRequestException(`Name must be between 1 and ${MAX_NAME_LENGTH} characters`);
    }

    await this.findOne(orgId);

    return this.prisma.organization.update({
      where: { id: orgId },
      data: { name: trimmed },
    });
  }

  findMembers(orgId: string) {
    return this.prisma.membership.findMany({
      where: { orgId },
      include: { user: true },
    });
  }

  countMembers(orgId: string) {
    return this.prisma.membership.count({ where: { orgId } });
  }

  async inviteMember(orgId: string, email: string, role: string) {
    this.assertValidRole(role);

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('No user found with that email');
    }

    const existing = await this.prisma.membership.findUnique({
      where: { userId_orgId: { userId: user.id, orgId } },
    });
    if (existing) {
      throw new BadRequestException('User is already a member of this organization');
    }

    return this.prisma.membership.create({
      data: { userId: user.id, orgId, role },
      include: { user: true },
    });
  }

  async updateMemberRole(orgId: string, membershipId: string, role: string) {
    this.assertValidRole(role);
    const membership = await this.findOwnedMembership(orgId, membershipId);

    if (membership.role === 'owner' && role !== 'owner') {
      await this.assertNotLastOwner(orgId);
    }

    return this.prisma.membership.update({
      where: { id: membershipId },
      data: { role },
      include: { user: true },
    });
  }

  async removeMember(orgId: string, membershipId: string) {
    const membership = await this.findOwnedMembership(orgId, membershipId);

    if (membership.role === 'owner') {
      await this.assertNotLastOwner(orgId);
    }

    await this.prisma.membership.delete({ where: { id: membershipId } });
    return true;
  }

  private async findOwnedMembership(orgId: string, membershipId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: { id: membershipId, orgId },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    return membership;
  }

  private async assertNotLastOwner(orgId: string) {
    const ownerCount = await this.prisma.membership.count({ where: { orgId, role: 'owner' } });
    if (ownerCount <= 1) {
      throw new BadRequestException('Cannot remove the last owner of the organization');
    }
  }

  private assertValidRole(role: string) {
    if (!VALID_ROLES.includes(role)) {
      throw new BadRequestException(`Role must be one of: ${VALID_ROLES.join(', ')}`);
    }
  }
}
