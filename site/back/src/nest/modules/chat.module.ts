import { Module } from "@nestjs/common";
import { ChatGateway } from "../gateways/chat.gateway";
import EventsModule from "./events.module";
import UserModule from "./user.module";

@Module({
	providers: [ChatGateway],
	exports: [ChatGateway],
	imports: [EventsModule, UserModule]
})
export class ChatModule {}