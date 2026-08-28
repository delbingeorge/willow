import { Module } from '@nestjs/common';
import { OrganizationResolver } from './organization.resolver.js';
import { OrganizationService } from './organization.service.js';

@Module({
  providers: [OrganizationResolver, OrganizationService],
})
export class OrganizationModule {}
