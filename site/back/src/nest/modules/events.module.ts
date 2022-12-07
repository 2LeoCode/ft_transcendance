import { Module } from "@nestjs/common";
import EventsGateway from "../gateways/events.gateway";
import AuthModule from "./auth.module";
import UserModule from "./user.module";

@Module({
	imports: [AuthModule, UserModule],
	controllers: [],
	providers: [EventsGateway],
	exports: [EventsGateway]
})
export default class EventsModule {}
