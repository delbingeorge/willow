import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service.js';
import { getJwtSecret } from './jwt-secret.js';
import type { AuthenticatedUser } from './types/authenticated-user.js';

interface JwtPayload {
  sub: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const membership = await this.prisma.membership.findFirst({
      where: { userId: payload.sub },
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
}
