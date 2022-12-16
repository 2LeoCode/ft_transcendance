import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";
import MessageService from "../services/message.service";
import UserService from "../services/user.service";
import EventsGateway from "./events.gateway";

@WebSocketGateway({
	namespace: 'events',
})
export class ChatGateway {
	constructor(
		private readonly eventsGateway: EventsGateway,
		private readonly userService: UserService,
		private readonly messageService: MessageService,
	) {}

	@SubscribeMessage('privMsg')
	async handlePrivMsg(
		@ConnectedSocket() client: Socket,
		@MessageBody() [
			receiverId,
			msg
		]
	) {
		const sender = this.eventsGateway.connectedUsers.find(
			usr => usr.socketId == client.id
		);
		const receiver = this.eventsGateway.connectedUsers.find(
			usr => usr.userId == receiverId
		);

		console.log(receiverId, '+',  msg);
		console.log(this.eventsGateway.connectedUsers);
		if (receiver) {
			try {
				let res = await this.userService.sendPrivMsg(sender.userId, receiver.userId, msg);
				res = await this.messageService.getFull({ id: res.id });
				this.eventsGateway.server.to(receiver.socketId).emit('recvPrivMsg', res);
				client.emit('sendPrivMsg', res);
			} catch (e) {
				client.emit('privMsgError', e.message);
			}
		} else {
			client.emit('privMsgError', 'User not found');
		}
	}

}