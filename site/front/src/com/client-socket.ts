import { io } from "socket.io-client";

const ClientSocket = io(`ws://localhost:2000/events`, {
	transports: ['websocket'],
	upgrade: false,
	reconnection: false,
	reconnectionAttempts: Infinity
});

ClientSocket.connect();

window.onbeforeunload = () => {
	ClientSocket.close();
}

ClientSocket.on('error', (err) => {
	console.log(err);
})

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
