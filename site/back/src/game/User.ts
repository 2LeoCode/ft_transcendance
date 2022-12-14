import { GameMode, UserStatus } from "./Constants";

export class User {
	// id: number;
	username: string;	// user
	// ratio?: number;
	status?: UserStatus;
	socketId: string;
	roomId?: string;

	mode?: GameMode;
	isWaiting?: boolean;

	constructor(socketId: string, username: string) {
		// this.id = id;
		this.username = username;
		// this.ratio = ratio;
		this.socketId = socketId
		this.isWaiting = false;
	}

	setUsername(username: string) {
		this.username = username;
	}

	setUserStatus(status: UserStatus) {
		this.status = status;
	}

	setSocketId(socketId: string) {
		this.socketId = socketId;
	}

	setRoomId(roomId: string | undefined) {
		this.roomId = roomId;
	}

	setMode(mode: string) {
		if (mode === "speed")
			this.mode = GameMode.SPEED;
		else if (mode === "colors")
			this.mode = GameMode.COLOR;
		else
			this.mode = GameMode.DEFAULT;
	}

	setIsWaiting(isWaiting: boolean) {
		this.isWaiting = isWaiting;
	}
}

export class ConnectedUsers {
	private users: Array<User> = new Array();

	constructor(private maxUser: number = Infinity) {}

	addUser(user: User) {
		if (this.maxUser !== this.users.length){
			this.users.push(user);
		}
	}

	removeUser(userRm: User) {
		let userIndex: number = this.users.findIndex(user => user.socketId === userRm.socketId);
		if (userIndex !== -1)
			this.users.splice(userIndex, 1);
	}

	getUser(socketId: string): User | undefined {
		let userIndex: number = this.users.findIndex(user => user.socketId === socketId);
		if (userIndex === -1)
			return undefined;
		return this.users[userIndex];
	}

	// getUserById(id: number): User | undefined {
	// 	let userIndex: number = this.users.findIndex(user => user.id === id);
	// 	if (userIndex === -1)
	// 		return undefined;
	// 	return this.users[userIndex];
	// }

	getUserBySocketId(socketId: string): User | undefined {
		let userIndex: number = this.users.findIndex(user => user.socketId === socketId);
		if (userIndex === -1)
			return undefined;
		return this.users[userIndex];
	}

	changeUserStatus(socketId: string, status: UserStatus) {
		let user: User = this.getUser(socketId);
		user.setUserStatus(status);
	}

	setGameMode(socketId: string, mode: string) {
		let user: User = this.getUser(socketId);
		user.setMode(mode);
	}

	setIsWaiting(socketId: string, isWaiting: boolean) {
		let user: User = this.getUser(socketId);
		user.setIsWaiting(isWaiting);
	}

}
