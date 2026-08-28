import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { AuthenticatedUser } from './types/authenticated-user.js';

const DEV_USER_EMAIL = 'dev@willow.local';
const DEV_USER_NAME = 'Dev User';
const DEV_ORG_NAME = 'Dev Workspace';
const DEV_ORG_SLUG = 'dev-workspace';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async devLogin() {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('Dev login is not available in production');
    }

    const user = await this.getOrCreateDevUser();
    const accessToken = await this.jwtService.signAsync({ sub: user.id });

    return { accessToken, user };
  }

  async resolveAuthenticatedUser(userId: string): Promise<AuthenticatedUser> {
    const membership = await this.prisma.membership.findFirst({
      where: { userId },
      include: { user: true },
    });

    if (!membership) {
      throw new UnauthorizedException();
    }

    return {
      id: membership.user.id,
      email: membership.user.email,
      name: membership.user.name,
      orgId: membership.orgId,
      role: membership.role,
    };
  }

  private async getOrCreateDevUser() {
    const existing = await this.prisma.user.findUnique({
      where: { email: DEV_USER_EMAIL },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.user.create({
      data: {
        email: DEV_USER_EMAIL,
        name: DEV_USER_NAME,
        memberships: {
          create: {
            role: 'owner',
            organization: {
              create: { name: DEV_ORG_NAME, slug: DEV_ORG_SLUG },
            },
          },
        },
      },
    });
  }
}
