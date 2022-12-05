import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ChannelEntity from '../entities/channel.entity';
import ChannelService from '../services/channel.service';
import ChannelController from '../controllers/channel.controller';
import ReceiverModule from './receiver.module';
import MessageModule from './message.module';

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
