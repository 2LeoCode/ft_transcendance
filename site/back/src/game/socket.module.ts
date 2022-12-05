import { Module } from "@nestjs/common";
import { SocketEvents } from "./socket.gateway";

@Module({
	providers: [SocketEvents],
	exports: [SocketEvents],
})
export class SocketModule {}