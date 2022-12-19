import { User } from "./User";
import { GameMode, GameState } from "./Constants";
import { Entity, Paddle, Paddle2, Ball, Game, paddleWidth, paddleHeight, ballSize, wallOffset } from './game';

export interface IRoom {
	roomId: string;
	gameState: GameState;
	players: User[];
	playerOne: Paddle;
	playerTwo: Paddle2;
	ball: Ball;

	// Game timestamps
	timestampStart: number;
	lastUpdate: number;
	goalTimestamp: number;
	pauseTime: {pause: number, resume: number}[];

	// settings customisation
	maxGoal: number;

	timer: number;
	gameDuration: number;
}

export type SerializeRoom = {
	roomId: string;
	gameState: GameState;

	playerOne: {
		user: {
			socketId: string;
			// username: string;
		}
		width: number;
		height: number;
		x: number;
		y: number;
		score: number;
	};

	playerTwo: {
		user: {
			socketId: string;
			// username: string;
		}
		width: number;
		height: number;
		x: number;
		y: number;
		score: number;
	};

	ball: {
		x: number;
		y: number;
	},

	mode: number;
};

export default class Room implements IRoom {
	roomId: string;
	gameState: GameState;
	players: User[];
	playerOne: Paddle;
	playerTwo: Paddle2;
	ball: Ball;

	timestampStart: number;
	lastUpdate: number;
	goalTimestamp: number;
	pauseTime: {pause: number, resume: number}[];

	isGameEnd: boolean;
	otherLeft: boolean;
	lostConnection: boolean;

	// settings customisation
	maxGoal: number;
	mode: GameMode;
	timer: number;
	gameDuration: number;

	constructor(
		roomId: string,
		users: User[],
		customisation: { mode?: GameMode } = { mode: GameMode.DEFAULT }
	) {
	this.roomId = roomId;
	this.gameState = GameState.STARTING;
	this.players = [];
	this.playerOne = new Paddle(users[0], paddleWidth, paddleHeight, wallOffset, 100 / 2 - paddleHeight / 2);
    this.playerTwo = new Paddle2(users[1], paddleWidth, paddleHeight, 200 - (wallOffset + paddleWidth) , 100 / 2 - paddleHeight / 2);
	this.ball = new Ball(ballSize, ballSize, 200 / 2 - ballSize / 2, 100 / 2 - ballSize / 2);

	this.timestampStart = Date.now();
	this.lastUpdate = Date.now();
	this.goalTimestamp = Date.now();
	this.pauseTime = [];

	this.mode = customisation.mode;
	this.playerOne.gameMode = this.mode;
	this.playerTwo.gameMode = this.mode;
	this.maxGoal = 11;

	this.isGameEnd = false;
	this.otherLeft = false;
	this.lostConnection = false;

	this.timer = 0;
	this.gameDuration = 60000 * 5; // 1min * num of minutes
	}

	isAPlayer(user: User): boolean {
		if (!this.playerOne.user)
			return false;
		return (this.playerOne.user.socketId === user.socketId || this.playerTwo.user.socketId === user.socketId);
	}

	addUser(user: User) {
		this.players.push(user);	// push user in User[]
	}

	removeUser(userRm: User) {
		const userIndex: number = this.players.findIndex(user => user.socketId === userRm.socketId);
		if (userIndex !== -1)
			this.players.splice(userIndex, 1);
	}

	getDuration(): number {
		let duration: number = Date.now() - this.timestampStart;

		this.pauseTime.forEach((pause) => {
			duration -= (pause.pause - pause.resume) - 3500;
		});
		return duration;
	}

	changeGameState(newGameState: GameState): void {
		this.gameState = newGameState;
	}

	start(): void {
		this.timestampStart = Date.now();
		this.lastUpdate = Date.now();
		this.changeGameState(GameState.PLAYING);
	}

	update(currentTimestamp: number): void {
		let secondPassed: number = (currentTimestamp - this.lastUpdate) / 1000;
		this.lastUpdate = currentTimestamp;

		this.playerOne.update();
		this.playerTwo.update();
		this.ball.update(this.playerOne, this.playerTwo);
		this.playerOne.score = this.ball.score1;
		this.playerTwo.score = this.ball.score2;
	}

	// pauseForfait() {
	// 	if (this.players[0].id === this.playerOne.user.id)
	// 		this.changeGameState(GameState.PLAYERONEWIN);
	// 	else
	// 		this.changeGameState(GameState.PLAYERTWOWIN);
	// }

	serialize(): SerializeRoom { // send the littlest amount of data
		const newSerializeRoom: SerializeRoom = {
			roomId: this.roomId,
			gameState: this.gameState,
			playerOne: {
				user: {
					socketId: this.playerOne.user.socketId,
					// username: this.playerOne.user.username,
				},
				width: this.playerOne.width,
				height: this.playerOne.height,
				x: this.playerOne.x,
				y: this.playerOne.y,
				score: this.playerOne.score,
			},
			playerTwo: {
				user: {
					socketId: this.playerTwo.user.socketId,
					// username: this.playerTwo.user.username,
				},
				width: this.playerTwo.width,
				height: this.playerTwo.height,
				x: this.playerTwo.x,
				y: this.playerTwo.y,
				score: this.playerTwo.score,
			},
			ball: {
				x: this.ball.x,
				y: this.ball.y,
			},
			mode: this.mode,
		};
		return newSerializeRoom;
	} 
}
