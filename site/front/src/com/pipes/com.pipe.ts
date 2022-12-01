import { io } from 'socket.io-client';
import EntityParser from '../entity-parser';
import PublicChannel from '../interfaces/public-channel.interface';
import PublicUser from '../interfaces/public-user.interface';
import UserPipe from '../user.pipe';

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
			await this.publicUsers;
			await this.publicChannels;
			return this;
		})() as any as ComPipe;
	}

	readonly user = (async () => 
		new UserPipe(
			this,
			await EntityParser.user(
				await fetch(`${this.backendHost}/user`, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${this.jwtToken}`
					}
				}).then(res => res.json())
			)
		)
	)();

	readonly publicChannels: Promise<PublicChannel[]> = fetch(`${this.backendHost}/channel`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${this.jwtToken}`
		}
	}).then(async res => (await res.json()).map(async (channel: any) =>
			this.entityParser.publicChannel(channel)
		)
	);

	readonly publicUsers: Promise<PublicUser[]> = fetch(`${this.backendHost}/user/public`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${this.jwtToken}`
		}
	}).then(async res => (await res.json()).map(async (channel: any) =>
			this.entityParser.publicUser(channel)
		)
	);
}
