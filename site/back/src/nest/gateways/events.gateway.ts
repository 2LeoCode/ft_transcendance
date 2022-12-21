import { Injectable } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import UserEntity from "../entities/user.entity";
import { ImageDto } from "../dtos/image.dto";

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

	async connectClient(
		client: Socket,
		user: UserEntity,
		payload: any,
	) {
		this.userService.updateByName(
			payload.username,
			{ online: true }
		);

		const channels = await this.userService.getChannels(user.id);
	
		channels.forEach(channel => client.join(channel.id));

		client.broadcast.emit('clientConnected', user);
		client.emit('connected');
	}

	async handleConnection(
		client: Socket
	) {
		const token = client.handshake.auth.token;
		const token_2fa = client.handshake.auth.token_2fa;
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
			//client.emit('onConnection', payload);

			if (dbUser.twoFactorSecret) {
				try {
					const res = await this.authService.verify(token_2fa);
				} catch {
					client.emit('twoFactorRequired', await this.authService.generateQrCodeDataURL(dbUser));
					client.disconnect(true);
					return ;
				}
			}
			this.connectClient(client, dbUser, payload);
		} catch (e) {
			client.disconnect(true);
		}
	}

	async handleDisconnect(
		client: Socket
	) {
		const user = this.connectedUsers.find(usr => usr.socketId == client.id);
		if (!user) return;
		this.userService.updateByName(
			user.username,
			{ online: false }
		);
		const index = this.connectedUsers.findIndex(usr => usr.socketId == client.id);
		this.server.emit('clientDisconnected', this.connectedUsers[index].username);
		this.connectedUsers.splice(index, 1);
		//this.server.emit('changeFriendOnline', user.username, false);
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
			const users = await this.userService.getPublic(filter);
			if (!users.length)
				client.emit('usersNotFound');
			else
				client.emit('foundUsers', users);
		} catch (e) {
			client.emit('error', e);
		}
	}

	@SubscribeMessage('2fa-on')
	async twoFactorOn(
		@ConnectedSocket() client: Socket
	) {
		try {
			const userId = this.connectedUsers.find(usr => usr.socketId == client.id).userId;
			await this.userService.enable2fa(userId);
			client.emit('enabled-2fa');
		} catch (e) {
			client.emit('error', e);
		}
	}

	@SubscribeMessage('2fa-off')
	async twoFactorOff(
		@ConnectedSocket() client: Socket
	) {
		try {
			const userId = this.connectedUsers.find(usr => usr.socketId == client.id).userId;
			await this.userService.disable2fa(userId);
			client.emit('disabled-2fa');
		} catch (e) {
			client.emit('error', e);
		}
	}

	@SubscribeMessage('changeNickname')
	async changeNickname(
		@ConnectedSocket() client: Socket,
		@MessageBody() nickname: string
	) {
		try {
			const userId = this.connectedUsers.find(usr => usr.socketId == client.id).userId;
			await this.userService.update(userId, { nick: nickname });
			client.emit('changedNickname', nickname);
			const userPublic = await this.userService.getOnePublic({ id: userId });
			client.broadcast.emit('userChangedNickname', userPublic);
			const user = await this.userService.getOne(userId);
			user.channels.forEach(channel => this.server.to(channel.id).emit('channelUserChangedNickname', channel));
		} catch (e) {
			client.emit('error', e.message);
		}
	}

	@SubscribeMessage('uploadAvatar')
	async handleUploadAvatar(
		@ConnectedSocket() client: Socket,
		@MessageBody() {
			name,
			type,
			buffer
		} : {
			name: string,
			type: string,
			buffer: Buffer
		}
	) {
    const image = new ImageDto();
    image.filename = name;
    image.mimetype = type;
    image.buffer = buffer;
		const userId = this.connectedUsers.find(usr => usr.socketId == client.id).userId;
    //const publicUserA = await this.userService.getOnePublic({ id: userId });

		await this.userService.changeAvatar(userId, image);

		const publicUser = await this.userService.getOnePublic({ id: userId });

    // Send the uploaded image back to the client
    client.emit('uploadedAvatar', publicUser.avatar);
		client.broadcast.emit('userUploadedAvatar', publicUser);
	}

	@SubscribeMessage('getOtherUserAvatar')
	async getOtherUserAvatar(
		@ConnectedSocket() client: Socket,
		@MessageBody() user42: string
	) {
		const user = await this.userService.getOnePublic({ user42: user42 });
		client.emit('otherUserAvatar', user.avatar);
	}
}
