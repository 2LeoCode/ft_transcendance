import { ConsoleLogger, Inject, Injectable, Logger } from "@nestjs/common";
import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import AuthService from "../services/auth.service";

@WebSocketGateway({
	namespace: "events",
	transports: ["websocket"],
})
@Injectable()
export default class EventsGateway implements OnGatewayConnection {

	constructor(
		private readonly authService: AuthService,
	) { }

	@WebSocketServer()
	server: Server;

	readonly connectedUsers: { socketId: string, username: string }[] = [];

	async handleConnection(
		client: Socket
	) {
		const token = client.handshake.headers.cookie?.split('token=')[1]?.split(';')[0]?.trim() || '';
		console.log('token=', token);
		try {
			await this.authService.verify(token);
			const payload: any = await this.authService.decode(token);
			//console.log(payload);
			this.connectedUsers.push({ socketId: client.id, username: payload.username });
			//console.log(this.connectedUsers);
			//client.emit('onConnection', payload);
		} catch (e) {
			console.log('bad token');
			client.disconnect(true);
		}
		console.log('Client good!');
	}

	async handleDisconnection(
		client: Socket
	) {
		console.log('goodbye');
		this.connectedUsers.splice(this.connectedUsers.findIndex(usr => usr.socketId == client.id))
	}
	@SubscribeMessage('ping')
	ping(client: Socket) {
		client.emit('pong');
	}


}
