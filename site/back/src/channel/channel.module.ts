import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ChannelEntity from './channel.entity';
import ChannelService from './channel.service';
import ChannelController from './channel.controller';
import ReceiverModule from '../receiver/receiver.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([ChannelEntity]),
		ReceiverModule
	],
	controllers: [ChannelController],
	providers: [ChannelService],
	exports: [ChannelService,]
})
export default class ChannelModule {}
