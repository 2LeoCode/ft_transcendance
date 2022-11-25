import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ReceiverModule from '../receiver/receiver.module';
import MessageModule from '../message/message.module';
import ScoreModule from '../score/score.module';
import ChannelModule from '../channel/channel.module';
import UserEntity from './user.entity';
import UserController from './user.controller';
import UserService from './user.service';
import AuthModule from 'src/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity]),
		ReceiverModule,
		MessageModule,
		ScoreModule,
		ChannelModule
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export default class UserModule {}
