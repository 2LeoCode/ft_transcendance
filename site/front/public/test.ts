import { io } from "socket.io-client";

const socket = io("http://localhost:2000");

socket.on('2 players', () => {
    console.log("coucou from game! 2 players");
});