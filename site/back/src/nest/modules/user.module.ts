import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ReceiverModule from './receiver.module';
import MessageModule from './message.module';
import ScoreModule from './score.module';
import ChannelModule from './channel.module';
import UserEntity from '../entities/user.entity';
import UserController from '../controllers/user.controller';
import UserService from '../services/user.service';
import ImageEntity from '../entities/image.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity, ImageEntity]),
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
