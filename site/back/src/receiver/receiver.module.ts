import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Receiver from "./receiver.entity";
import ReceiverService from "./receiver.service";

@Module({
	imports: [TypeOrmModule.forFeature([Receiver])],
	providers: [ReceiverService],
	exports: [ReceiverService],
})
export default class ReceiverModule {}
