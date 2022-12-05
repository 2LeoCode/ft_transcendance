import { ConsoleLogger, Inject, Logger } from "@nestjs/common";
import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import AuthService from "../services/auth.service";

@WebSocketGateway({
	namespace: "events",
	transports: ["websocket"],
})
export default class EventsGateway implements OnGatewayConnection {

	constructor(
		private readonly authService: AuthService,
	) { }

	@WebSocketServer()
	server: Server;

	async handleConnection(
		client: Socket
	) {
		const token = client.handshake.headers.cookie?.split('token=')[1]?.split(';')[0]?.trim() || '';
		try {
			await this.authService.verify(token);
		} catch (e) {
			client.disconnect(true);
		}
		console.log('Client good!');
	}

	@SubscribeMessage('ping')
	ping(client: Socket) {
		client.emit('pong');
	}
}
