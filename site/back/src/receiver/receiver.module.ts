import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ReceiverService from './receiver.service';
import ReceiverEntity from './receiver.entity';

@Module({
	imports: [TypeOrmModule.forFeature([ReceiverEntity])],
	providers: [ReceiverService],
	exports: [ReceiverService]
})
export default class ReceiverModule {}
