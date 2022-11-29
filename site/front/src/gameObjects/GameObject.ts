export enum GameState {
	WAITING,
	STARTING,
	PLAYING,
	PAUSED,
	RESUMED,
	PLAYERONESCORED,
	PLAYERTWOSCORED,
	PLAYERONEWIN,
	PLAYERTWOWIN,
}

export enum GameMode {
	DEFAULT,
	TIMER,
	LIFE
}

export type User = {
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
	goal: number;
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

	timestampStart: number;
	goalTimestamp: number;
	pauseTime: {pause: number, resume: number}[];

	winner: string;
	loser: string;

	mode: GameMode;

	timer: number;
	gameDuration: number;
}