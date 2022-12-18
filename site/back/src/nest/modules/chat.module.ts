import { Module } from "@nestjs/common";
import { ChatGateway } from "../gateways/chat.gateway";
import ChannelModule from "./channel.module";
import EventsModule from "./events.module";
import MessageModule from "./message.module";
import UserModule from "./user.module";

@Module({
	providers: [ChatGateway],
	exports: [ChatGateway], 
	imports: [EventsModule, UserModule, MessageModule, ChannelModule]
})
export class ChatModule {}