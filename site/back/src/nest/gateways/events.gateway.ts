import { ConsoleLogger, Inject, Injectable, Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
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
	) {  }

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
			});

			this.connectedUsers.push({
				socketId: client.id,
				username: payload.username,
				userId: dbUser.id
			});
			//console.log(this.connectedUsers);
			//client.emit('onConnection', payload);
			this.userService.updateByName(
				payload.username,
				{ online: true }
			);
			//console.log('Client good!');
			dbUser.online = true;

			const channels = await this.userService.getChannels(dbUser.id);
		
			for (const channel of channels)
				client.join(channel.id);

			console.log(`hello ${payload.username}`);
			//console.log('list:', this.connectedUsers.map(usr => usr.username).join(', '));
			//console.log('broadcasting to all clients');
			client.broadcast.emit('clientConnected', dbUser);
		} catch (e) {
			//console.log('bad token');
			client.disconnect(true);
		}
	}

	async handleDisconnect(
		client: Socket
	) {
	//	console.log('goodbye');
		const user = this.connectedUsers.find(usr => usr.socketId == client.id);
		console.log(`goodbye ${user?.username} (${client.id})`);
		if (!user) return;
		this.userService.updateByName(
			user.username,
			{ online: false }
		);
		const index = this.connectedUsers.findIndex(usr => usr.socketId == client.id);
		this.server.emit('clientDisconnected', this.connectedUsers[index].username);
		this.connectedUsers.splice(index, 1);
	}

	@SubscribeMessage('ping')
	ping(client: Socket) {
		client.emit('pong');
	}

	@SubscribeMessage('findUsers')
	async findUser(
		@ConnectedSocket() client: Socket,
		@MessageBody() filter: {
			nick?: string,
			user42?: string,
		}
	) {
		try {
			console.log(filter);
			const users = await this.userService.getPublic(filter);
			if (!users.length)
				client.emit('usersNotFound');
			else
				client.emit('foundUsers', users);
		} catch (e) {
			client.emit('chatError', e);
		}
	}

}
