import { io } from 'socket.io-client';
import EntityParser from '../entity-parser';
import PublicChannel from '../interfaces/public-channel.interface';
import PublicUser from '../interfaces/public-user.interface';
import User from '../interfaces/user.interface';
import { atom, Atom } from 'jotai';

export default class ComPipe {

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
				'Authorization': `Bearer ${ComPipe.jwtToken}`,
			}
		});
		socket.on('connect', () => {
			console.log('Connected to server');
		});
		socket.on('clientConnected', (data: any) => {
			console.log('Client connected', data as PublicUser);
		});
		socket.on('clientDisconnected', (data: any) => {
			console.log('Client disconnected', data as PublicUser);
		});

	});

	static user = (async () => 
		EntityParser.user(
			await fetch(`${ComPipe.serverHost}/user`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${ComPipe.jwtToken}`
				}
			}).then(res => res.json())
		)
	)() as any as User;

	static visibleChannels = (async () => 
		atom(
			await fetch(`${ComPipe.serverHost}/channel`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${ComPipe.jwtToken}`
				}
			}).then(async res => (await res.json()).map((channel: any) =>
				EntityParser.publicChannel(channel)
			))
		)
	)() as any as Atom<PublicChannel[]>;

	static onlineUsers = (async () =>
		atom(
			await fetch(`${ComPipe.serverHost}/user/public`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${ComPipe.jwtToken}`
				}
			}).then(async res => (await res.json()).map((channel: any) =>
					EntityParser.publicUser(channel)
				)
			)
		)
	)() as any as Atom<PublicUser[]>;
}
