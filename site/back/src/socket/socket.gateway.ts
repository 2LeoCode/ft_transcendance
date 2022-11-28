import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
export class SocketEvents {
	@WebSocketServer()
	server: Server;

	//connection
	handleConnection(client: Socket){
		//console.log(`Client connected: ${client.id}`);
	}

	//disconnection
	handleDisconnect(client: Socket){
		//console.log(`Client disconnected: ${client.id}`);
	}

	//receive an event
	@SubscribeMessage('message')
	handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket){
		//send an event
		this.server.emit('message', client.id, data);
	}

	@SubscribeMessage('client connected')
	handleConnectionToGame(@MessageBody() data: string, @ConnectedSocket() client: Socket){
		//send an event
		console.log("coucou from client connected");
		this.server.emit('client connected', client.id);
	}

	@SubscribeMessage('join room')
	handleJoinRoomEvent(@ConnectedSocket() client: Socket){
		//send an event
		console.log("coucou from join room event");
		this.server.socketsJoin("room1");
	}

}