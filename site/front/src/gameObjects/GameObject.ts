export enum GameState {
	WAITING,
	STARTING,
	PLAYING,
	// PLAYERONESCORED,
	// PLAYERTWOSCORED,
	PLAYERONEWIN,
	PLAYERTWOWIN,
}

export enum GameMode {
	DEFAULT,
	SPEED,
	COLOR
}

export type User = {
	socketId: string;
	id: number;
	username: string;
	ratio?: number;
}

export interface IPaddle {
	user: User;
    width: number;
    height: number;
	x: number;
	y: number;
	score: number;
}

export interface IBall {
    width: number;
    height: number;
	x: number;
	y: number;
}

export interface IRoom {
	roomId: string;
	gameState: GameState;
	playerOne: IPaddle;
	playerTwo: IPaddle;
	ball: IBall;

	winner: string;
	loser: string;

	mode: GameMode;
}