import { io } from 'socket.io-client';
import UserPipe from './user.pipe';

export default class ComPipe {

	private readonly socket = io(this.backendHost, {
		transports: ['websocket'],
		upgrade: false,
		reconnection: true,
		reconnectionDelay: 1000,
		reconnectionDelayMax: 5000,
		reconnectionAttempts: Infinity
	});

	constructor(
		readonly backendHost: string,
		readonly jwtToken: string
	) {
		return (async () => {
			this.socket.auth = { token: this.jwtToken };
			this.socket.connect();
			await this.user;
			await this.channels;
			return this;
		})() as any as ComPipe;
	}


	private readonly user = (async () => new UserPipe(
		this,
		await fetch(`${this.backendHost}/user`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${this.jwtToken}`
				}
		}).then(res => res.json())
	))();

	private readonly channels = fetch(`${this.backendHost}/channel`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${this.jwtToken}`
		}
	}).then(res => res.json());
}
