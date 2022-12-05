import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import MessageEntity from '../entities/message.entity';
import MessageController from '../controllers/message.controller';
import MessageService from '../services/message.service';
import ReceiverModule from './receiver.module';

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
