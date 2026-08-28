import { Controller, Get, Param } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator.js';
import { ShareService } from './share.service.js';

@Controller('shared')
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @Public()
  @Get(':token')
  getSharedDocument(@Param('token') token: string) {
    return this.shareService.findByToken(token);
  }
}
