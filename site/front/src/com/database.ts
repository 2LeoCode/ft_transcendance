import { io } from 'socket.io-client';
import EntityParser from './entity-parser';
import PublicChannel from './interfaces/public-channel.interface';
import PublicUser from './interfaces/public-user.interface';
import User from './interfaces/user.interface';
import { atom, Atom } from 'jotai';

export default class Database {

	static readonly serverHost = 'http://localhost:2000';
	static readonly jwtToken =
		document.cookie
			.split(';')
			.map((cookie) => cookie.split('='))
			.find((cookie) => cookie[0] === 'token')?.[1] || '';

	static readonly socket = (() => {
		const socket = io(this.serverHost, {
			transports: ['websocket'],
			upgrade: false,
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
			reconnectionAttempts: Infinity,
			extraHeaders: {
				'Authorization': `Bearer ${Database.jwtToken}`,
			}
		});
		socket.on('connect', () => {
			console.log('Connected to server');
		});
		socket.on('clientConnected', (user: any) => {
			console.log('Client connected', EntityParser.user(user));
		});
		socket.on('clientDisconnected', (user: any) => {
			console.log('Client disconnected', EntityParser.user(user));
		});
		socket.on('incomingPrivMsg', (message: any) => {
			console.log('Incoming private message', EntityParser.message(message, 'user'));
		});
		socket.on('incomingChannelMsg', (message: any) => {
			console.log('Incoming channel message', EntityParser.message(message, 'channel'));
		});
		// ...
		return socket;
	})();

	static user = (async () => 
		EntityParser.user(
			await fetch(`${Database.serverHost}/user`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${Database.jwtToken}`
				}
			}).then(res => res.json())
		)
	)() as any as User;

	static visibleChannels = (async () => 
		atom(
			await fetch(`${Database.serverHost}/channel`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${Database.jwtToken}`
				}
			}).then(async res => (await res.json()).map((channel: any) =>
				EntityParser.publicChannel(channel)
			))
		)
	)() as any as Atom<PublicChannel[]>;

	static onlineUsers = (async () =>
		atom(
			await fetch(`${Database.serverHost}/user/public`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${Database.jwtToken}`
				}
			}).then(async res => (await res.json()).map((channel: any) =>
					EntityParser.publicUser(channel)
				)
			)
		)
	)() as any as Atom<PublicUser[]>;

	static syncServerData = async () => {
		Database.user = await (Database.user as any as Promise<User>);
		Database.visibleChannels = await (Database.visibleChannels as any as Promise<Atom<PublicChannel[]>>);
		Database.onlineUsers = await (Database.onlineUsers as any as Promise<Atom<PublicUser[]>>);
	}
}
