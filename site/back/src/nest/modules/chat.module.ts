import { Module } from "@nestjs/common";
import { ChatGateway } from "../gateways/chat.gateway";
import EventsModule from "./events.module";

@Module({
	providers: [ChatGateway],
	exports: [ChatGateway],
	imports: [EventsModule]
})
export class ChatModule {}