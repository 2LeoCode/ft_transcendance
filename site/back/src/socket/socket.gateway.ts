import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

let numConnected = 0;
let previousId = "0";

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
	handleConnectionToGame(@ConnectedSocket() client: Socket){
		//send an event
		console.log("coucou " + client.id);
		this.server.socketsJoin("room1");
		this.server.emit('room joined', client.id);
		console.log("coucou from join room event");

		if (client.id !== previousId) {
			numConnected = numConnected + 1;
			previousId = client.id;
		}

		if (numConnected === 2) { 
			console.log("2 playersssss");
			this.server.emit('2 players', client.id);
			// emit vers le jeu et fait la waiting page en interne.
		}

	}

}