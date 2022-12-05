import { Server, Socket } from 'socket.io';
import Room from '../game/Room';
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
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private readonly chatUsers: ChatUsers = new ChatUsers();
  private readonly currentUsers: Array<User> = new Array();
  private readonly currentChannel: Array<Room> = new Array();
  private readonly rooms: Map<string, Room> = new Map();
  private tmpMessage:string;

  constructor() {}

  // createNewRoomDm(own: string, other: string): void {
  // 	const roomId: string = `${own}&${other}`;
  // 	let room: Room = new Room(roomId, null);
  // 	// console.log("roomId = " + roomId);

  // 	this.server.to(own).emit("newRoom", room);
  // 	if (other)
  // 		this.server.to(other).emit("newRoom", room);
  // 	this.rooms.set(roomId, room);
  // 	this.currentChannel.push(room);

  // 	this.server.emit("updatecurrentChannel", this.currentChannel);
  // }

  afterInit(server: Server) {
    console.log('[+] Init Chat Gateway');
  }

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('disconnect')
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    // let user = this.chatUsers.getUser(client.id);

    const userIndex: number = this.currentUsers.findIndex(
      (toRemove) => toRemove.socketId === client.id,
    );
    if (userIndex !== -1) {
      this.currentUsers.splice(userIndex, 1);
    }
    // this.server.emit('disconnect', this.currentUsers);

    console.log('disconnected client');

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
    @MessageBody() newUser: ChatUser,
  ) {
    let user = this.chatUsers.getUserById(client.id);

    console.log('coucou a toi ' + client.id);

    if (!user) {
      user = new ChatUser(client.id);

      // user.setUserStatus(UserStatus.ONLINE);
      this.chatUsers.addUser(user);

      this.currentUsers.push(user);
      this.server.emit('updateCurrentUsers', this.currentUsers);

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

  /**
   * Direct Messages
   */
  //  @SubscribeMessage('getUserDms')
  //  async handleUserDms(
  // 	 @ConnectedSocket() client: Socket,
  // 	 @MessageBody() { userId }: { userId: number }
  //  ) {
  // 	 const dms = await this.chatService.getUserDms(userId);

  // 	 for (const dm of dms) {
  // 		 this.userJoinRoom(client.id, `dm_${dm.id}`);
  // 	 }
  // 	 this.server.to(client.id).emit('updateUserDms', (dms));
  //  }

  //  @SubscribeMessage('getDmData')
  //  async handleDmData(
  // 	 @ConnectedSocket() client: Socket,
  // 	 @MessageBody() { dmId }: { dmId: number }
  //  ) {
  // 	 const dm = await this.chatService.getDmData(dmId);
  // 	 const roomId = `dm_${dm.id}`;

  // 	 this.userJoinRoom(client.id, roomId);
  // 	 this.server.to(client.id).emit('updateDm', (dm));
  //  }

  // userJoinRoom(socketId: string, roomId: string) {
  // 	this.chatUsers.addRoomToUser(socketId, roomId);
  // 	this.server.in(socketId).socketsJoin(roomId);
  // }

  // userLeaveRoom(socketId: string, roomId: string) {
  // 	this.chatUsers.addRoomToUser(socketId, roomId);
  // 	this.server.in(socketId).socketsLeave(roomId);
  // }

   @SubscribeMessage('DmRoom')
   async handleCreateDm(
  	 @ConnectedSocket() client: Socket,
  	 @MessageBody() otherId: string
   ) {
		// load old db messages here
  		// this.createNewRoomDm(client.id, otherId);
  		//  this.server.to(client.id).emit('openCreatedDm', client);
   }

  @SubscribeMessage('submitMessage')
  handleMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() other: string,
    // @MessageBody() message: string,
  ) {
	console.log("other = " + other);
//     // -> faire appel a la db pour stocker le message
    this.server.to(client.id).emit('NewCreatedDm', this.tmpMessage, true);
    this.server.to(other).emit('NewCreatedDm', this.tmpMessage, false);
  }

  @SubscribeMessage('tmpMessageStock')
  handleTmpMessageStack(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: string,
  ) {
	console.log("new message back " + message);
	this.tmpMessage = message;
//     // -> faire appel a la db pour stocker le message
  }
  

  // 	 /* Save a new DM message */
  // 	 @UseFilters(new BadRequestTransformationFilter())
  // 	 @SubscribeMessage('dmSubmit')
  // 	 async handleDmSubmit(
  // 		 @ConnectedSocket() client: Socket,
  // 		 @MessageBody() data: CreateDmMessageDto
  // 	 ) {
  // 		 if (data.type || data.roomId) {
  // 			 throw new WsException('Unauthorized operation.');
  // 		 }
  // 		 try {
  // 			 const message = await this.chatService.addMessageToDm(data);

  // 			 this.server.to(`dm_${message.dm.id}`).emit('newDm', { message });
  // 			 this.logger.log(`New message in DM [${message.dm.id}]`);
  // 		 } catch (e) {
  // 			 this.server.to(client.id).emit('chatError', e.message);
  // 		 }
  // 	 }
  //  }
}
