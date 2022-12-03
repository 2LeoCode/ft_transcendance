import { GameMode, UserStatus } from "./Constants";

export class User {
	// id: number;
	// username: string;
	// ratio?: number;
	status?: UserStatus;
	socketId: string;
	roomId?: string;

	mode?: GameMode;

	constructor(socketId: string) {
		// this.id = id;
		// this.username = username;
		// this.ratio = ratio;
		this.socketId = socketId
	}

	// setUsername(username: string) {
	// 	this.username = username;
	// }

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
}

export class ConnectedUsers {
	private users: Array<User> = new Array();

	constructor(private maxUser: number = Infinity) {}

	addUser(user: User) {
		if (this.maxUser !== this.users.length){
			console.log("user in addUser id: " + user.socketId);
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
		console.log("user in getUser id: " + socketId);
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
		console.log("in connected user " + mode);
		user.setMode(mode);
	}

}
