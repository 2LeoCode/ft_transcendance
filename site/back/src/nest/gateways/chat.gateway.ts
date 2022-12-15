import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";
import UserService from "../services/user.service";
import EventsGateway from "./events.gateway";

@WebSocketGateway({
	namespace: 'events',
})
export class ChatGateway {
	constructor(
		private readonly eventsGateway: EventsGateway,
		private readonly userService: UserService,
	) {}

	@SubscribeMessage('privMsg')
	async handlePrivMsg(
		@ConnectedSocket() client: Socket,
		receiverId: string,
		msg: string
	) {
		const sender = this.eventsGateway.connectedUsers.find(
			usr => usr.socketId == client.id
		);
		const receiver = this.eventsGateway.connectedUsers.find(
			usr => usr.userId == receiverId
		);

		if (receiver) {
			this.userService.sendPrivMsg(sender.userId, receiver.userId, msg);
			this.eventsGateway.server.to(receiver.socketId).emit('recvPrivMsg', msg);
			client.emit('sendPrivMsg', msg);
		} else {
			client.emit('privMsgError', 'User not found');
		}
	}

}