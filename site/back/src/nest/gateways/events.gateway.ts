import { ConsoleLogger, Inject, Injectable, Logger } from "@nestjs/common";
import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

@WebSocketGateway({
	namespace: "events",
	transports: ["websocket"],
})
@Injectable()
export default class EventsGateway implements OnGatewayConnection {

	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
	) { console.log('EventsGateway constructor') }

	@WebSocketServer()
	server: Server;

	readonly connectedUsers: {
		socketId: string,
		username: string,
		userId: string,
	}[] = [];

	async handleConnection(
		client: Socket
	) {
		const token = client.handshake.auth.token;
		// console.log('token=', token);
		try {
			await this.authService.verify(token);
			const payload: any = await this.authService.decode(token);

			const dbUser = await this.userService.getOnePublic({
				user42: payload.username
			})

			this.connectedUsers.push({
				socketId: client.id,
				username: payload.username,
				userId: dbUser.id
			});
			console.log(this.connectedUsers);
			//client.emit('onConnection', payload);
			this.userService.updateByName(
				payload.username,
				{ online: true }
			);
			console.log('Client good!');
			dbUser.online = true;
			this.server.emit('userConnected', dbUser);
		} catch (e) {
			console.log('bad token');
			client.disconnect(true);
		}
	}

	async handleDisconnect(
		client: Socket
	) {
		console.log('goodbye');
		const user = this.connectedUsers.find(usr => usr.socketId == client.id);
		if (!user) return;
		this.userService.updateByName(
			user.username,
			{ online: false }
		);
		const index = this.connectedUsers.findIndex(usr => usr.socketId == client.id);
		this.server.emit('userDisconnected', this.connectedUsers[index].username);
		this.connectedUsers.splice(index, 1);
	}
	@SubscribeMessage('ping')
	ping(client: Socket) {
		client.emit('pong');
	}


}
