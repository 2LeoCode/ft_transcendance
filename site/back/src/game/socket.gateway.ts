import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { Entity, Paddle, Paddle2, Ball, Game, paddleWidth, paddleHeight, ballSize, wallOffset } from './game';

let numConnected = 0;
let previousId = null;
let paddle1 = new Paddle(paddleWidth, paddleHeight, wallOffset, 100 / 2 - paddleHeight / 2, null);
let paddle2 = new Paddle2(paddleWidth, paddleHeight, 200 - (wallOffset + paddleWidth) , 100 / 2 - paddleHeight / 2, null);
let ball = new Ball(ballSize, ballSize, 200 / 2 - ballSize / 2, 100 / 2 - ballSize / 2);
let now = getCurrentTime();
let lastUpdate = 0;
let then = now;
let fps = 5;

function getCurrentTime() {
	const date: number = Date.now();
	return date;
}

function update() {
	paddle1.update();
	paddle2.update();
	ball.update(paddle1, paddle2);
	paddle1.score = ball.score1;
	paddle2.score = ball.score2;
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
				
				this.server.emit('2 players', client.id);
			}

			this.server.socketsJoin("room1");
			this.server.emit('room joined', client.id);
		}


	}

	@SubscribeMessage('keyDown')
	async handleKeyUp(@ConnectedSocket() client: Socket, @MessageBody() key: string) {


		if (client.id === paddle1.id)
		{
			if (key === 'ArrowUp')
				paddle1.ArrowUp = true;
			if (key === 'ArrowDown')
				paddle1.ArrowDown = true;
		}
		else if (client.id === paddle2.id)
		{
			if (key === 'ArrowUp')
				paddle2.ArrowUp = true;
			if (key === 'ArrowDown')
				paddle2.ArrowDown = true;
		}
	}

	@SubscribeMessage('keyUp')
	async handleKeyDown(@ConnectedSocket() client: Socket, @MessageBody() key: string) {

		if (client.id === paddle1.id)
		{
			if (key === 'ArrowUp') {
				paddle1.ArrowUp = false;
			}
			if (key === 'ArrowDown')
				paddle1.ArrowDown = false;
		}
		else if (client.id === paddle2.id)
		{
			if (key === 'ArrowUp')
				paddle2.ArrowUp = false;
			if (key === 'ArrowDown')
				paddle2.ArrowDown = false;
		}
	}
	
	@SubscribeMessage('requestUpdate')
	handleRequestUpdate(@ConnectedSocket() client: Socket){
		const currentTimestamp: number = Date.now();
		update();
		const payload = {
			x: ball.x,
			y: ball.y,
			paddle1x: paddle1.x,
			paddle1y: paddle1.y,
			paddle2x: paddle2.x,
			paddle2y: paddle2.y,
			score1: paddle1.score,
			score2: paddle2.score,
		}
		this.server.emit("updatedRoom", payload);
	}

}