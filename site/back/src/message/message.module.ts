import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import MessageEntity from './message.entity';
import MessageController from './message.controller';
import MessageService from './message.service';
import ReceiverModule from '../receiver/receiver.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([MessageEntity]),
		ReceiverModule
	],
	controllers: [MessageController],
	providers: [MessageService],
	exports: [MessageService]
})
export default class MessageModule {}
