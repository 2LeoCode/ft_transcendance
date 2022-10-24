import { Module } from '@nestjs/common';
import { PrivateMessageController } from './private-message.controller';
import { PrivateMessageService } from './private-message.service';

@Module({
  controllers: [PrivateMessageController],
  providers: [PrivateMessageService]
})
export class PrivateMessageModule {}
