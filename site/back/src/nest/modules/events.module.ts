import { Module } from "@nestjs/common";
import EventsGateway from "../gateways/events.gateway";
import AuthModule from "./auth.module";

@Module({
	imports: [AuthModule],
	controllers: [],
	providers: [
		EventsGateway
	],
})
export default class EventsModule {}
