import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ChannelEntity from './channel.entity';
import ChannelService from './channel.service';
import ChannelController from './channel.controller';
import ReceiverModule from '../receiver/receiver.module';
import MessageEntity from 'src/message/message.entity';
import MessageModule from 'src/message/message.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([ChannelEntity]),
		ReceiverModule,
		MessageModule
	],
	controllers: [ChannelController],
	providers: [ChannelService],
	exports: [ChannelService]
})
export default class ChannelModule {}
