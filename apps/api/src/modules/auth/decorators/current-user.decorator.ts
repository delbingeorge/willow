import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { AuthenticatedUser } from '../types/authenticated-user.js';

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
  const request =
    ctx.getType<'http' | 'graphql'>() === 'graphql' ? GqlExecutionContext.create(ctx).getContext().req : ctx.switchToHttp().getRequest();
  return request.user;
});
