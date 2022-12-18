import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { ChannelAccessibility, ChannelVisibility } from "../entities/channel.entity";
import ChannelService from "../services/channel.service";
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
		private readonly channelService: ChannelService,
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

		try {
			const res = await this.userService.sendPrivMsg(sender.userId, receiverId, msg);
			if (receiver)
				this.eventsGateway.server.to(receiver.socketId).emit('recvPrivMsg', res);
			client.emit('sendPrivMsg', res);
		} catch (e) {
			client.emit('chatError', e.message);
		}
	}

	@SubscribeMessage('createChannel')
	async handleCreateChannel(
		@ConnectedSocket() client: Socket,
		@MessageBody() [
			channelName,
			channelPassword,
			channelVisibility,
			channelAccessibility
		] : [
			string,
			string,
			ChannelVisibility,
			ChannelAccessibility
		]
	) {
		const sender = this.eventsGateway.connectedUsers.find(
			usr => usr.socketId == client.id
		);

		try {
			const res = await this.channelService.add(
				sender.userId, {
					name: channelName,
					password: channelPassword,
					visibility: channelVisibility,
					accessibility: channelAccessibility
				}
			);
			client.join(res.id);
			client.emit('createdChannel', res);
			if (res.visibility === 'visible')
				client.broadcast.emit('newPublicChannel', res);
		} catch (e) {
			client.emit('chatError', e.message);
		}
	}

	@SubscribeMessage('joinChannel')
	async handleJoinChannel(
		@ConnectedSocket() client: Socket,
		@MessageBody() [
			channelName,
			channelPassword
		] : [
			string,
			string
		]
	) {
		const sender = this.eventsGateway.connectedUsers.find(
			usr => usr.socketId == client.id
		);

		try {
			const res = await this.channelService.join(
				sender.userId,
				channelName,
				channelPassword
			);
			const user = await this.userService.getOnePublic({ id: sender.userId });
			client.emit('joinedChannel', res);
			client.broadcast.to(res.id).emit('newUserOnChannel', res);
			client.join(res.id);
		} catch (e) {
			client.emit('chatError', e.message);
		}
	}

	@SubscribeMessage('channelMsg')
	async handleChannelMsg(
		@ConnectedSocket() client: Socket,
		@MessageBody() [
			channelId,
			msg
		] : [
			string,
			string
		]
	) {
		const sender = this.eventsGateway.connectedUsers.find(
			usr => usr.socketId == client.id
		);
		const channel = await this.channelService.getOneFull(channelId);

		try {
			let res = await this.channelService.addMessage(sender.userId, channel.id, msg);
			client.emit('sentChannelMsg', res);
			client.broadcast.to(channelId).emit('recvChannelMsg', res);
		} catch (e) {
			client.emit('chatError', e.message);
		}
	}

	@SubscribeMessage('leaveChannel')
	async handleLeaveChannel(
		@ConnectedSocket() client: Socket,
		@MessageBody() channelId: string
	) {
		const sender = this.eventsGateway.connectedUsers.find(
			usr => usr.socketId == client.id
		);

		try {
			const res = await this.channelService.leave(sender.userId, channelId);
			
			if (res.owner.id === sender.userId) {
				this.eventsGateway.server.emit('deletedChannel', res.id);
				this.eventsGateway.server
					.in(channelId).socketsLeave(channelId);
		  } else {
				client.emit('leftChannel', res);
				client.broadcast.to(channelId).emit('userLeftChannel', res);
				client.leave(channelId);
			}
		} catch (e) {
			client.emit('chatError', e.message);
		}
	}

	@SubscribeMessage('mute')
	async handleMute(
		@ConnectedSocket() client: Socket,
		@MessageBody() [
			channelId,
			userId,
			seconds
		] : [
			string,
			string,
			number
		]
	) {
		const sender = this.eventsGateway.connectedUsers.find(
			usr => usr.socketId == client.id
		);
		const receiver = this.eventsGateway.connectedUsers.find(
			usr => usr.userId == userId
		);

		try {
			const res = await this.channelService.mute(sender.userId, channelId, userId);
			this.eventsGateway.server.to(channelId).emit('muted', res);
			if (receiver)
				this.eventsGateway.server.to(receiver.socketId).emit('gotMuted', res);
			setTimeout(async () => {
				try {
					const res = await this.channelService.unmute(sender.userId, channelId, userId);
					this.eventsGateway.server.to(channelId).emit('unmuted', res);
				} catch {}
			}, seconds * 1000);
		} catch (e) {
			client.emit('chatError', e.message);
		}
	}

	@SubscribeMessage('ban')
	async handleBan(
		@ConnectedSocket() client: Socket,
		@MessageBody() [
			channelId,
			userId,
			seconds
		] : [
			string,
			string,
			number
		]
	) {
		const sender = this.eventsGateway.connectedUsers.find(
			usr => usr.socketId == client.id
		);
		const receiver = this.eventsGateway.connectedUsers.find(
			usr => usr.userId == userId
		);

		try {
			const res = await this.channelService.ban(sender.userId, channelId, userId);
			this.eventsGateway.server.to(channelId).emit('banned', res);
			if (receiver) {
				this.eventsGateway.server.to(receiver.socketId).emit('gotBanned', res);
				this.eventsGateway.server.in(receiver.socketId).socketsLeave(channelId);
			}
			setTimeout(async () => {
				try {
					const res = await this.channelService.unban(sender.userId, channelId, userId);
					this.eventsGateway.server.to(channelId).emit('unbanned', res);
				} catch {}
			}, seconds * 1000);
		} catch (e) {
			client.emit('chatError', e.message);
		}
	}

	@SubscribeMessage('promote')
	async handlePromote(
		@ConnectedSocket() client: Socket,
		@MessageBody() [
			channelId,
			userId
		] : [
			string,
			string
		]
	) {
		const sender = this.eventsGateway.connectedUsers.find(
			usr => usr.socketId == client.id
		);

		try {
			const res = await this.channelService.promote(sender.userId, channelId, userId);
			this.eventsGateway.server.to(channelId).emit('promoted', res);
		} catch (e) {
			client.emit('chatError', e.message);
		}
	}

	@SubscribeMessage('demote')
	async handleDemote(
		@ConnectedSocket() client: Socket,
		@MessageBody() [
			channelId,
			userId
		] : [
			string,
			string
		]
	) {
		const sender = this.eventsGateway.connectedUsers.find(
			usr => usr.socketId == client.id
		);

		try {
			const res = await this.channelService.demote(sender.userId, channelId, userId);
			this.eventsGateway.server.to(channelId).emit('demoted', res);
		} catch (e) {
			client.emit('chatError', e.message);
		}
	}
}