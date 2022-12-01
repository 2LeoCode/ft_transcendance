import React, { useState, useEffect } from "react";
// import ReactJS from "react";
import { io, Socket } from 'socket.io-client';
import Header from "../components/Header";
import "../styles/Pong.css";
import Game from "../components/Game";
import { GameState, IRoom, User } from "../gameObjects/GameObject";

let socket: Socket;

export type onGoingGame = {
	roomId: string;
	playerOne: string;
	playerTwo: string;
};

function Pong() {
  // const [isReady, setIsReady] = useState<boolean | any>(false);
  const [play, setPlay] = useState<boolean>(false);
  const [inQueue, setInQueue] = useState<boolean>(false);
  const [room, setRoom] = useState<IRoom | null>(null);
  const [currentGames, setCurrentGames] = useState<onGoingGame[]>([]);


	let roomData: IRoom;
  let roomId: string | undefined;
  let user: User;

  
  const joinQueue = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("onClick joinQueue");
    socket.emit('joinQueue', e.currentTarget.value);
  }

  const leaveQueue = () => {
    console.log("leave queue");
    socket.emit("leaveQueue");
  }

  const updateCurrentGames = (currentGamesData: IRoom[]) => {
		const games: onGoingGame[] = [];

		for (const game of currentGamesData) {
			games.push({
				roomId: game.roomId,
				playerOne: game.playerOne.user.username,
				playerTwo: game.playerTwo.user.username,
			});
		}
		setCurrentGames(games);
	};
  
	useEffect((): any => {


    socket = io("http://localhost:2000");

    // when a client arrives on page localhost:3000/pong
    socket.on("connect", () => {
      console.log("connect");
			// Allow reconnection
			socket.emit("handleUserConnect", user); // user is gonna be the user from chat if needed 

			socket.emit("getCurrentGames");
    });
    
    socket.on("updateCurrentGames", (currentGamesData: IRoom[]) => {
			updateCurrentGames(currentGamesData);
		}); 

		socket.on("newRoom", (newRoomData: IRoom) => {
			if (newRoomData.gameState === GameState.WAITING && user.id != newRoomData.playerOne.user.id) {
        console.log("return");
				return ;
			}
			socket.emit("joinRoom", newRoomData.roomId);
			roomData = newRoomData;
			roomId = newRoomData.roomId;
			setRoom(roomData);
			setInQueue(false);
		});

    socket.on("joinedQueue", () => {
      console.log("joinQueue");
      setInQueue(true);
    });

    socket.on("leavedQueue", () => {
      setInQueue(false);
    });

    socket.on("joinedRoom", () => {
      setPlay(true);
    });

		socket.on("joinedRoom", () => {
      console.log("joined room in front");
			// if (chatSocket) {
			// 	chatSocket.emit("userGameStatus", { isPlaying: true }); // user status "is playing"
			// }
			setPlay(true);
		});

		socket.on("leavedRoom", () => {
			// if (chatSocket) {
			// 	chatSocket.emit("userGameStatus", { isPlaying: false }); // user status "not playing"
			// }
			roomId = undefined;
			setPlay(false);
			setRoom(null);
		});

    return () => {
        // if (chatSocket) {
        //   chatSocket.emit("userGameStatus", { isPlaying: false }); // user status
        // }
        if (socket) {
          socket.disconnect();
        }
      }
  }, []);

  return (
    <div>
      <Header />
      <div className="Pong">
        {!play && inQueue && (
          <button
            value={'colors'}
            type="button"
            className="play_button"
            onClick={leaveQueue}            // create room on the onClick
          >
            Leave
          </button>

        )}
        {!play && !inQueue && (
          <button
          value={'speed'}
            type="button"
            className="play_button"
            onClick={joinQueue}            // create room on the onClick
          >
            Speed
          </button>)}
        {!play && !inQueue && (
          <button
            onClick={joinQueue}
            value={'classic'}
            type="button"
            className="play_button"
          >
            Classic
          </button>
        )}
        {!play && !inQueue && (
          <button
            value={'colors'}
            type="button"
            className="play_button"
            onClick={joinQueue}            // create room on the onClick
          >
            Colors
          </button>
        )}
        {play && <Game socketProps={socket} roomProps={room}></Game>}
      </div>
    </div>
  );
}

export default Pong;
