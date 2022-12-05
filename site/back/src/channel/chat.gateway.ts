import { Server, Socket } from 'socket.io';
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsException,
} from '@nestjs/websockets';
import { User } from 'src/game/User';
import { ChatUser, ChatUsers } from './class/ChatUsers';
import { UserStatus } from 'src/game/Constants';

@WebSocketGateway({
    cors: {
        origin: '*',
    }
})


export class ChatGateway implements OnGatewayInit, OnGatewayConnection {
    
    @WebSocketServer()
		server: Server;

	private readonly chatUsers: ChatUsers = new ChatUsers();
	private readonly currentUsers: Array<User> = new Array();
    
    constructor() {}


	afterInit(server: Server) {
		console.log('[+] Init Chat Gateway');
	}

	async handleConnection(client: Socket){
        console.log(`Client connected: ${client.id}`);
    }

	@SubscribeMessage('disconnect')
	async handleDisconnect(@ConnectedSocket() client: Socket) {
		// let user = this.chatUsers.getUser(client.id);

		const userIndex: number = this.currentUsers.findIndex((toRemove) => toRemove.socketId === client.id);
		if (userIndex !== -1) {
			this.currentUsers.splice(userIndex, 1);
		}
		this.server.emit("updatecurrentUsers", this.currentUsers);

        console.log("disconnected client");

		// if (user) {
			// this.server.emit('updateUserStatus', {
			// 	userId: user.id,
			// 	status: UserStatus[UserStatus.OFFLINE]
			// });

			// this.chatUsers.removeUser(user);
		// }
	}
    
    @SubscribeMessage('updateChatUser')
	handleNewUser(
		@ConnectedSocket() client: Socket,
		@MessageBody() newUser: ChatUser
	) {

        let user = this.chatUsers.getUserById(client.id);
        
        console.log("coucou a toi " + client.id);

		if (!user) {
			user = new ChatUser(client.id);

			// user.setUserStatus(UserStatus.ONLINE);
            this.chatUsers.addUser(user);

			this.currentUsers.push(user);
			this.server.emit("updateCurrentUsers", this.currentUsers);
            
            this.server.emit('getUserId', client.id);
		}
		// } else {
		// 	user.setSocketId(client.id);
		// 	// user.setUsername(newUser.username);
		// }
		// this.server.emit('updateUserStatus', {
		// 	userId: user.socketId,
		// 	status: UserStatus[user.status]
		// });
    }


}