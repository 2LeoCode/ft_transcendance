import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { Entity, Paddle, Paddle2, Ball, Game, paddleWidth, paddleHeight, ballSize, wallOffset } from './game';

let numConnected = 0;
let previousId = "0";
let paddle1 = new Paddle(paddleWidth, paddleHeight, wallOffset, 100 / 2 - paddleHeight / 2, null);


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
		paddle1.id = client.id;

		this.server.socketsJoin("room1");
		this.server.emit('room joined', client.id);

		if (client.id !== previousId) {
			numConnected = numConnected + 1;
			previousId = client.id;
		}

		if (numConnected === 2) {
			console.log("2 playersssss");
			
			this.server.emit('2 players');
		}

	}
	
	@SubscribeMessage('ArrowUp pressed')
	handleArrowUpPressed(@MessageBody() data: string, @ConnectedSocket() client: Socket){
		// console.log("arrow up pressed server.on with client id : " + client.id);
		if (client.id === paddle1.id){
			paddle1.ArrowUp = true;
			paddle1.update();
			const payload = {
				x: paddle1.x,
				y: paddle1.y,
			}
			this.server.emit('update paddle1', payload);
		}
	}
	@SubscribeMessage('ArrowUp released')
	handleArrowUpRealeased(@MessageBody() data: string, @ConnectedSocket() client: Socket){
		// console.log("arrow up released server.on with client id : " + client.id);
		if (client.id === paddle1.id){
			paddle1.ArrowUp = false;
			paddle1.update();
		}
	}
	@SubscribeMessage('ArrowDown pressed')
	handleArrowDownPressed(@MessageBody() data: string, @ConnectedSocket() client: Socket){
		// console.log("arrow Down pressed server.on with client id : " + client.id);
		if (client.id === paddle1.id){
			paddle1.ArrowDown = true;
			paddle1.update();
		}
	}
	@SubscribeMessage('ArrowDown released')
	handleArrowDownRealeased(@MessageBody() data: string, @ConnectedSocket() client: Socket){
		// console.log("arrow Down released server.on with client id : " + client.id);
		if (client.id === paddle1.id){
			paddle1.ArrowDown = false;
			paddle1.update();
		}
	}

}