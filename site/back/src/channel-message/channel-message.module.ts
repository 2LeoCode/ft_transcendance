import { Module } from '@nestjs/common';
import { ChannelMessageController } from './channel-message.controller';
import { ChannelMessageService } from './channel-message.service';

@Module({
  controllers: [ChannelMessageController],
  providers: [ChannelMessageService]
})
export class ChannelMessageModule {}
