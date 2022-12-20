import { io } from "socket.io-client";
import Constants from "./constants";

const ClientSocket = io(`ws://localhost:2000/events`, {
	transports: ['websocket'],
	upgrade: false,
	reconnection: false,
	autoConnect: false,
	auth: {
		token: Constants.jwtToken,
		token_2fa: Constants.jwtToken2fa,
	}
});

window.onbeforeunload = () => {
	ClientSocket.close();
}

ClientSocket.on('error', (err: any) => {
	console.warn(err);
});

//ClientSocket.on('privMsg', (message: any) => {
//	console.log('Incoming private message', message);
//});
//
//ClientSocket.on('channelMsg', (message: any) => {
//	console.log('Incoming channel message', message);
//});

export default ClientSocket;
