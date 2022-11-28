import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserController from './user.controller';
import UserService from './user.service';
import User from './user.entity';
import ReceiverModule from 'src/receiver/receiver.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ReceiverModule],
  controllers: [UserController],
  providers: [UserService],
})
export default class UserModule {}
