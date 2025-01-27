import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get('count')
  @UseGuards(JwtAuthGuard)
  public async getChatsCount() {
    return this.chatsService.countChats();
  }
}
