import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { Entity, Paddle, Paddle2, Ball, Game, paddleWidth, paddleHeight, ballSize, wallOffset } from './game';

let numConnected = 0;
let previousId = null;
let paddle1 = new Paddle(paddleWidth, paddleHeight, wallOffset, 100 / 2 - paddleHeight / 2, null);
let paddle2 = new Paddle2(paddleWidth, paddleHeight, 200 - (wallOffset + paddleWidth) , 100 / 2 - paddleHeight / 2, null);
let ball = new Ball(ballSize, ballSize, 200 / 2 - ballSize / 2, 100 / 2 - ballSize / 2);
let now = getCurrentTime();
let elapsed = 0;
let then = now;
let fps = 5;

function getCurrentTime() {
	const date: number = Date.now();
	return date;
}

function update() {
		now = getCurrentTime();
		elapsed = now - then;        	// 1 try to implement the timing in the front and emit every frame one by one.
										// scores don't work or at least don't draw
		if (elapsed < fps){				// once finished with the game itself go do the rooms, the game modes, and the watch mode!
			return ;
		}
		else
			then = now;

		paddle1.update();
		paddle2.update();
		ball.update(paddle1, paddle2);

}

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
		if (numConnected < 2) {
			if (previousId === null) {
				paddle1.id = client.id;
				numConnected = numConnected + 1;
				previousId = client.id;
			} else if (client.id !== previousId) {
				paddle2.id = client.id;
				numConnected = numConnected + 1;
				previousId = client.id;
			}
			if (numConnected === 2) {
				console.log("2 playersssss");
				update();
				
				this.server.emit('2 players');
			}

			this.server.socketsJoin("room1");
			this.server.emit('room joined', client.id);
		}


	}
	
	@SubscribeMessage('ArrowUp pressed')
	handleArrowUpPressed(@MessageBody() data: string, @ConnectedSocket() client: Socket){
		if (client.id === paddle1.id){
			paddle1.ArrowUp = true;
			const payload = {
				x: paddle1.x,
				y: paddle1.y,
				ballx: ball.x,
				bally: ball.y,
			}
			update();
			this.server.emit('update paddle1', payload);
		} else if (client.id === paddle2.id){
			paddle2.ArrowUp = true;
			const payload = {
				x: paddle2.x,
				y: paddle2.y,
				ballx: ball.x,
				bally: ball.y,
			}
			update();
			this.server.emit('update paddle2', payload);
		}
	}
	@SubscribeMessage('ArrowUp released')
	handleArrowUpRealeased(@MessageBody() data: string, @ConnectedSocket() client: Socket){
		if (client.id === paddle1.id){
			paddle1.ArrowUp = false;
			const payload = {
				x: paddle1.x,
				y: paddle1.y,
				ballx: ball.x,
				bally: ball.y,
			}
			update();
			this.server.emit('update paddle1', payload);
		} else if (client.id === paddle2.id){
			paddle2.ArrowUp = false;
			const payload = {
				x: paddle2.x,
				y: paddle2.y,
				ballx: ball.x,
				bally: ball.y,
			}
			update();
			this.server.emit('update paddle2', payload);
		}
	}
	@SubscribeMessage('ArrowDown pressed')
	handleArrowDownPressed(@MessageBody() data: string, @ConnectedSocket() client: Socket){
		if (client.id === paddle1.id){
			paddle1.ArrowDown = true;
			const payload = {
				x: paddle1.x,
				y: paddle1.y,
				ballx: ball.x,
				bally: ball.y,
			}
			update();
			this.server.emit('update paddle1', payload);
		} else if (client.id === paddle2.id){
			paddle2.ArrowDown = true;
			const payload = {
				x: paddle2.x,
				y: paddle2.y,
				ballx: ball.x,
				bally: ball.y,
			}
			update();
			this.server.emit('update paddle2', payload);
		}
	}
	@SubscribeMessage('ArrowDown released')
	handleArrowDownRealeased(@MessageBody() data: string, @ConnectedSocket() client: Socket){
		if (client.id === paddle1.id){
			paddle1.ArrowDown = false;
			const payload = {
				x: paddle1.x,
				y: paddle1.y,
				ballx: ball.x,
				bally: ball.y,
			}
			update();
			this.server.emit('update paddle1', payload);
		} else if (client.id === paddle2.id){
			paddle2.ArrowDown = false;
			const payload = {
				x: paddle2.x,
				y: paddle2.y,
				ballx: ball.x,
				bally: ball.y,
			}
			update();
			this.server.emit('update paddle2', payload);
		}
	}

}