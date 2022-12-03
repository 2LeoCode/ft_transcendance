import { Server, Socket } from 'socket.io';
import Room from './Room';
import Queue from "./Queue";
import { User, ConnectedUsers } from './User';
import { GameMode, GameState, UserStatus } from './Constants';
import {
	MessageBody,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
	ConnectedSocket,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from "@nestjs/websockets";
import { Entity, Paddle, Paddle2, Ball, Game, paddleWidth, paddleHeight, ballSize, wallOffset } from './game';




	// let numConnected = 0;
	// let previousId = null;
	// let paddle1 = new Paddle(paddleWidth, paddleHeight, wallOffset, 100 / 2 - paddleHeight / 2, null);
	// let paddle2 = new Paddle2(paddleWidth, paddleHeight, 200 - (wallOffset + paddleWidth) , 100 / 2 - paddleHeight / 2, null);
	// let ball = new Ball(ballSize, ballSize, 200 / 2 - ballSize / 2, 100 / 2 - ballSize / 2);
	// let now = getCurrentTime();
	// let lastUpdate = 0;
	// let then = now;
	// let fps = 5;

	function getCurrentTime() {
		const date: number = Date.now();
		return date;
	}

	// function update() {
	// 	paddle1.update();
	// 	paddle2.update();
	// 	ball.update(paddle1, paddle2);
	// 	paddle1.score = ball.score1;
	// 	paddle2.score = ball.score2;
	// }

	@WebSocketGateway({
		cors: {
			origin: '*',
		},
	})
	export class SocketEvents implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{	
		
		constructor() {}

		@WebSocketServer()
		server: Server;
		
		private readonly queue: Queue = new Queue();
		private readonly rooms: Map<string, Room> = new Map();
		private readonly currentGames: Array<Room> = new Array();
		private readonly connectedUsers: ConnectedUsers = new ConnectedUsers();
	
		createNewRoom(players: User[]): void {
			const roomId: string = `${players[0].socketId}&${players[1].socketId}`;
			let room: Room = new Room(roomId, players, { mode: players[0].mode });
			console.log("roomId = " + roomId);
	
			this.server.to(players[0].socketId).emit("newRoom", room);
			this.server.to(players[1].socketId).emit("newRoom", room);
			this.rooms.set(roomId, room);
			this.currentGames.push(room);
	
			this.server.emit("updateCurrentGames", this.currentGames);
		}

		afterInit(server: Server) {
			console.log("when do  get here?");
			setInterval(() => {
				if (this.queue.size() > 1) { // && this.currentGames.length < MAX_SIMULTANEOUS_GAMES
					let players: User[] = Array();
	
					players = this.queue.matchPlayers();
					if (players.length === 0)
						return ;
					this.createNewRoom(players);
				}
			}, 5000);
		}

		//connection
		async handleConnection(client: Socket){
			//console.log(`Client connected: ${client.id}`);
		}

		@SubscribeMessage('handleUserConnect')
		handleConnectionToGame(@ConnectedSocket() client: Socket, @MessageBody() user: User){
			console.log("coucou from connect users");
			
			// let newUser: User = this.connectedUsers.getUserById(user.id); // users when connected
			let newUser: User = null;

			if (newUser) {
				newUser.setSocketId(client.id);
				// newUser.setUsername(user.username);
			} else {
				newUser= new User(client.id);
			}
			newUser.setUserStatus(UserStatus.INHUB);

			/* Verify that player is not already in a game */
			this.rooms.forEach((room: Room) => {
				if (room.isAPlayer(newUser) && room.gameState !== GameState.PLAYERONEWIN && room.gameState !== GameState.PLAYERTWOWIN) {
					newUser.setUserStatus(UserStatus.PLAYING);
					newUser.setRoomId(room.roomId);

					this.server.to(client.id).emit("newRoom", room);
					return ;
				}
			});
			this.connectedUsers.addUser(newUser);

			// if (numConnected < 2) {
			// 	if (previousId === null) {
			// 		paddle1.id = client.id;
			// 		numConnected = numConnected + 1;
			// 		previousId = client.id;
			// 	} else if (client.id !== previousId) {
			// 		paddle2.id = client.id;
			// 		numConnected = numConnected + 1;
			// 		previousId = client.id;
			// 	}
			// 	if (numConnected === 2) {
			// 		console.log("2 playersssss");
					
			// 		this.server.emit('2 players', client.id);
			// 	}

			// 	this.server.socketsJoin("room1");
			// 	this.server.emit('room joined', client.id);
			// }


		}

		//disconnection
		handleDisconnect(@ConnectedSocket() client: Socket){
			//console.log(`Client disconnected: ${client.id}`);
			console.log("getUser in disconnect");
			let user: User = this.connectedUsers.getUser(client.id);

		if (user) {
			this.rooms.forEach((room: Room) => {
				if (room.isAPlayer(user)) {
					room.removeUser(user);

					if (room.players.length === 0 && room.gameState !== GameState.WAITING) {
						this.rooms.delete(room.roomId);

						const roomIndex: number = this.currentGames.findIndex((toRemove) => toRemove.roomId === room.roomId);
						if (roomIndex !== -1) {
							this.currentGames.splice(roomIndex, 1);
						}
						this.server.emit("updateCurrentGames", this.currentGames);
					} 
					client.leave(room.roomId);
					return ;
				}
			});

			/* remove from queue and connected users */
			this.queue.remove(user);
			this.connectedUsers.removeUser(user);
		}
		}

		@SubscribeMessage('joinQueue')
		handleJoinQueue(@ConnectedSocket() client: Socket, @MessageBody() mode: string) {
			console.log("coucou from joinQueue server");
			const user: User = this.connectedUsers.getUser(client.id);
			if (!user) {
				user.setSocketId(client.id);
				console.log(user.socketId + " & " + client.id);
			}

			if (user && !this.queue.isInQueue(user)) {
				this.connectedUsers.changeUserStatus(client.id, UserStatus.INQUEUE);
				this.connectedUsers.setGameMode(client.id, mode);
				this.queue.enqueue(user);

				this.server.to(client.id).emit('joinedQueue');
			}
		}

		@SubscribeMessage('leaveQueue')
		handleLeaveQueue(@ConnectedSocket() client: Socket) {
			const user: User = this.connectedUsers.getUser(client.id);
	
			if (user && this.queue.isInQueue(user)) {
				this.queue.remove(user);
				this.server.to(client.id).emit('leavedQueue');
			}
		}

		@SubscribeMessage('spectateRoom')
		handleSpectateRoom(@ConnectedSocket() client: Socket, @MessageBody() roomId: string) {
			const room: Room = this.rooms.get(roomId);
	
			if (room) {
				const user = this.connectedUsers.getUser(client.id);
	
				if (!room.isAPlayer(user)) {
					this.server.to(client.id).emit("newRoom", room);
				}
			}
		}

		@SubscribeMessage('joinRoom')
		handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() roomId: string) {
			const room: Room = this.rooms.get(roomId);
	
			if (room) {
				const user = this.connectedUsers.getUser(client.id);
	
				client.join(roomId);
				if (user.status === UserStatus.INHUB) {
					this.connectedUsers.changeUserStatus(client.id, UserStatus.SPECTATING);
				} else if (room.isAPlayer(user)) {
					room.addUser(user);
				}
	
				this.server.to(client.id).emit("joinedRoom");
				this.server.to(client.id).emit("updateRoom", JSON.stringify(room.serialize()));
			}
		}

		@SubscribeMessage('leaveRoom')
		handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() roomId: string) {
			const room: Room = this.rooms.get(roomId);
			const user: User = this.connectedUsers.getUser(client.id);
	
			if (user && room) {
				room.removeUser(user);
	
				if (room.players.length === 0) {
					this.rooms.delete(room.roomId);
	
					const roomIndex: number = this.currentGames.findIndex((toRemove) => toRemove.roomId === room.roomId);
					if (roomIndex !== -1) {
						this.currentGames.splice(roomIndex, 1);
					}
					this.server.emit("updateCurrentGames", this.currentGames);
				}
	
				client.leave(room.roomId);
				this.connectedUsers.changeUserStatus(client.id, UserStatus.INHUB);
			}
			this.server.to(client.id).emit("leavedRoom");
		}

		//receive an event
		// @SubscribeMessage('message')
		// handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket){
		// 	//send an event
		// 	this.server.emit('message', client.id, data);
		// }

		secondToTimestamp(second: number): number{
			return (second * 1000);
		}

		@SubscribeMessage('requestUpdate')
		handleRequestUpdate(@MessageBody() roomId: string){
			const room: Room = this.rooms.get(roomId);

			if (room) {
				const currentTimestamp: number = Date.now();
	
				if (room.gameState === GameState.WAITING) {
					console.log("first client waiting...");
					if (room.players.length === 2) {
						room.gameState = GameState.STARTING;
						room.start();
					}
				}
				if (room.gameState === GameState.STARTING) {
					room.start();
				}
				else if (room.gameState === GameState.PLAYING)
				{
					// console.log("update back");
					room.update(currentTimestamp);
					if (room.isGameEnd)
						console.log("save game ici.");	
						// this.saveGame(room, currentTimestamp);
				}

				//ici insert game modes

				this.server.to(room.roomId).emit("updateRoom", JSON.stringify(room.serialize()));
			}


			// const currentTimestamp: number = Date.now();
			// update();
			// const payload = {
			// 	x: ball.x,
			// 	y: ball.y,
			// 	paddle1x: paddle1.x,
			// 	paddle1y: paddle1.y,
			// 	paddle2x: paddle2.x,
			// 	paddle2y: paddle2.y,
			// 	score1: paddle1.score,
			// 	score2: paddle2.score,
			// }
			// this.server.emit("updatedRoom", payload);
		}
		

		@SubscribeMessage('keyDown')
		async handleKeyUp(@ConnectedSocket() client: Socket, @MessageBody() data: {roomId: string, key: string}) {
			const room: Room = this.rooms.get(data.roomId);

			if (room && room.playerOne.user.socketId === client.id)
			{
				if (data.key === 'ArrowUp')
					room.playerOne.ArrowUp = true;
				if (data.key === 'ArrowDown')
					room.playerOne.ArrowDown = true;
			}
			else if (room && room.playerTwo.user.socketId === client.id)
			{
				if (data.key === 'ArrowUp')
					room.playerTwo.ArrowUp = true;
				if (data.key === 'ArrowDown')
					room.playerTwo.ArrowDown = true;
			}
		}

		@SubscribeMessage('keyUp')
		async handleKeyDown(@ConnectedSocket() client: Socket, @MessageBody() data: {roomId: string, key: string}) {
			const room: Room = this.rooms.get(data.roomId);

			if (room && room.playerOne.user.socketId === client.id)
			{
				if (data.key === 'ArrowUp')
					room.playerOne.ArrowUp = false;
				if (data.key === 'ArrowDown')
					room.playerOne.ArrowDown = false;
			}
			else if (room && room.playerTwo.user.socketId === client.id)
			{
				if (data.key === 'ArrowUp')
					room.playerTwo.ArrowUp = false;
				if (data.key === 'ArrowDown')
					room.playerTwo.ArrowDown = false;
			}
		}

		@SubscribeMessage('getCurrentGames')
		handleCurrentGames(@ConnectedSocket() client: Socket) {
			this.server.to(client.id).emit("updateCurrentGames", (this.currentGames));
		}

	}