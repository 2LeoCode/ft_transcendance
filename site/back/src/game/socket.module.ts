import { Module } from "@nestjs/common";
import { SocketEvents } from "./socket.gateway";

@Module({
	providers: [SocketEvents],
})
export class SocketModule {}