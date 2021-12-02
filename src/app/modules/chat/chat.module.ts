import { Module } from '@nestjs/common';
import { ChatResolver } from './chat.resolver';
import { ChatGateway } from './chat.gateway';

@Module({
  providers: [ChatResolver, ChatGateway],
})
export class ChatModule {}
