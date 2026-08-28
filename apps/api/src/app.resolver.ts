import { Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from './modules/auth/decorators/current-user.decorator.js';
import { Public } from './modules/auth/decorators/public.decorator.js';
import type { AuthenticatedUser } from './modules/auth/types/authenticated-user.js';

@Resolver()
export class AppResolver {
  @Public()
  @Query(() => String)
  ping(): string {
    return 'pong';
  }

  @Query(() => String)
  whoami(@CurrentUser() user: AuthenticatedUser): string {
    return user.email;
  }
}
