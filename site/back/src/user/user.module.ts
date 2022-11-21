import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ReceiverModule from '../receiver/receiver.module';
import MessageModule from '../message/message.module';
import ScoreModule from '../score/score.module';
import ChannelModule from '../channel/channel.module';
import UserEntity from './user.entity';
import UserController from './user.controller';
import UserService from './user.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity]),
		ReceiverModule,
		MessageModule,
		ScoreModule,
		ChannelModule
	],
	controllers: [UserController],
	providers: [UserService]
})
export default class UserModule {}
