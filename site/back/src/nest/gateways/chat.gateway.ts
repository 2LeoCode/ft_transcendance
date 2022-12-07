import { Server, Socket } from 'socket.io';
import Room from '../../game/Room';
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
import { ChatUser, ChatUsers } from '../../channel/class/ChatUsers';
import { UserStatus } from 'src/game/Constants';
import EventsGateway from './events.gateway';
import { channel } from 'diagnostics_channel';
import UserService from '../services/user.service';

@WebSocketGateway({
  namespace: 'events',
  //cors: {
  //  origin: '*',
  //},
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection {
  //@WebSocketServer()
  //server: Server;

  private readonly chatUsers: ChatUsers = new ChatUsers();
  private readonly currentUsers: Array<User> = new Array();
  private readonly currentChannels: Array<Room> = new Array();
  private readonly rooms: Map<string, Room> = new Map();
  private tmpMessage:string;

  constructor(
    private readonly eventsGateway: EventsGateway,
    private readonly userService: UserService,
  ) {}

    createNewRoomChannel( players: User[], channelName: string ): void {
        const roomId: string = `${channelName}`; // TODO remplacer toto par channel name
        let room: Room = new Room(roomId, players);
        console.log("roomId = " + roomId);

        this.eventsGateway.server.to(players[0].socketId).emit("newRoomChannel", room);
        // this.eventsGateway.server.to(players[1].socketId).emit("newRoom", room);
        this.rooms.set(roomId, room);
        this.currentChannels.push(room);
    
        this.eventsGateway.server.emit("ChannelCreated", this.currentChannels.find(usr => usr.roomId == roomId), channelName);
    }

  afterInit(server: Server) {
    console.log('[+] Init Chat Gateway');
  }

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  //@SubscribeMessage('disconnect')
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    // let user = this.chatUsers.getUser(client.id);

    const userIndex: number = this.currentUsers.findIndex(
      (toRemove) => toRemove.socketId === client.id,
    );
    if (userIndex !== -1) {
      this.currentUsers.splice(userIndex, 1);
    }
    // this.eventsGateway.server.emit('disconnect', this.currentUsers);

    console.log('disconnected client');

    // if (user) {
    // this.eventsGateway.server.emit('updateUserStatus', {
    // 	userId: user.id,
    // 	status: UserStatus[UserStatus.OFFLINE]
    // });

    // this.chatUsers.removeUser(user);
    // }
  }

  @SubscribeMessage('updateChatUser')
  async handleNewUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() newUser: ChatUser,
  ) {
    let user = this.chatUsers.getUserById(client.id);

    // console.log('coucou a toi ' + client.id);

    // get all users in db
    const connectedUsers = this.eventsGateway.connectedUsers;
    console.log('in updateChatUser');
    connectedUsers.forEach(usr => console.log(usr));

    if (!user) {
      user = new ChatUser(client.id, this.eventsGateway.connectedUsers.find(usr => usr.socketId == client.id).username);

      // user.setUserStatus(UserStatus.ONLINE);
      this.chatUsers.addUser(user);

      this.currentUsers.push(user);
      // this.eventsGateway.server.emit('ChannelCreated', this.currentUsers);

      this.eventsGateway.server.emit('getUserId', client.id);
      this.eventsGateway.server.emit('toAllMembers', connectedUsers);
    }
    // } else {
    // 	user.setSocketId(client.id);
    // 	// user.setUsername(newUser.username);
    // }
    // this.eventsGateway.server.emit('updateUserStatus', {
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
  // 	 this.eventsGateway.server.to(client.id).emit('updateUserDms', (dms));
  //  }

  //  @SubscribeMessage('getDmData')
  //  async handleDmData(
  // 	 @ConnectedSocket() client: Socket,
  // 	 @MessageBody() { dmId }: { dmId: number }
  //  ) {
  // 	 const dm = await this.chatService.getDmData(dmId);
  // 	 const roomId = `dm_${dm.id}`;

  // 	 this.userJoinRoom(client.id, roomId);
  // 	 this.eventsGateway.server.to(client.id).emit('updateDm', (dm));
  //  }

  // userJoinRoom(socketId: string, roomId: string) {
  // 	this.chatUsers.addRoomToUser(socketId, roomId);
  // 	this.eventsGateway.server.in(socketId).socketsJoin(roomId);
  // }

  // userLeaveRoom(socketId: string, roomId: string) {
  // 	this.chatUsers.addRoomToUser(socketId, roomId);
  // 	this.eventsGateway.server.in(socketId).socketsLeave(roomId);
  // }

  //@SubscribeMessage('DmRoom')
  //async handleCreateDm(
  // @ConnectedSocket() client: Socket,
  // @MessageBody() otherId: string
  //) {
  //  
	//// load old db messages here
  //	// this.createNewRoomDm(client.id, otherId);
  //	//  this.eventsGateway.server.to(client.id).emit('openCreatedDm', client);
  //}
   
   @SubscribeMessage('ChannelRoom')
   async handleChannelRoom(
  	 @ConnectedSocket() client: Socket,
  	 @MessageBody() channelName: string
   ) {
      const newUser= new User(client.id, this.eventsGateway.connectedUsers.find(usr => usr.socketId == client.id).username);
      let users: User[] = [];
      users.push(newUser);
      console.log("channel room")


      // load old db messages here
      const tmpRoomId = this.currentChannels.find(usr => usr.roomId == `${channelName}`);
      if (tmpRoomId) {
        console.log("client: " + client.id + " joined room: " + tmpRoomId.roomId);
				client.join(tmpRoomId.roomId);
        this.eventsGateway.server.emit("joinedChannelRoom", tmpRoomId.roomId);
      } else {
        this.createNewRoomChannel(users, channelName);
      }
        //  this.eventsGateway.server.to(client.id).emit('openCreatedDm', client);
   }

//   @SubscribeMessage('submitMessageDm')
//   handleMessages(
//     @ConnectedSocket() client: Socket,
//     @MessageBody() other: string,
//     // @MessageBody() message: string,
//   ) {
// 	// console.log("other = " + other);
// //     // -> faire appel a la db pour stocker le message
//     this.eventsGateway.server.to(client.id).emit('NewCreatedDm', this.tmpMessage, true);
//     this.eventsGateway.server.to(other).emit('NewCreatedDm', this.tmpMessage, false);
//   }

  @SubscribeMessage('submitMessageChannel')
  handleMessagesChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
    // @MessageBody() message: string,
  ) {
	// console.log("other = " + other);
     // -> faire appel a la db pour stocker le message
    this.eventsGateway.server.to(roomId).emit('NewCreatedChannelMessage', this.tmpMessage, false);
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

  // 			 this.eventsGateway.server.to(`dm_${message.dm.id}`).emit('newDm', { message });
  // 			 this.logger.log(`New message in DM [${message.dm.id}]`);
  // 		 } catch (e) {
  // 			 this.eventsGateway.server.to(client.id).emit('chatError', e.message);
  // 		 }
  // 	 }
  //  }
}
