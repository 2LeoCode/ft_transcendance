import { io } from "socket.io-client";
import Constants from "./constants";

const ClientSocket = io(`ws://localhost:2000/events`, {
	transports: ['websocket'],
	upgrade: false,
	reconnection: false,
	autoConnect: false,
	query: {
		token: Constants.jwtToken,
	}
});

window.onbeforeunload = () => {
	ClientSocket.close();
}

ClientSocket.on('error', (err: any) => {
	console.log(err);
});

ClientSocket.on('clientConnected', (user: any) => {
	console.log('Client connected', user);
});

ClientSocket.on('clientDisconnected', (user: any) => {
	console.log('Client disconnected', user);
});

ClientSocket.on('privMsg', (message: any) => {
	console.log('Incoming private message', message);
});

ClientSocket.on('channelMsg', (message: any) => {
	console.log('Incoming channel message', message);
});

export default ClientSocket;
