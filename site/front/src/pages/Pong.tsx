import React, { useState, useEffect, Fragment } from "react";
import { io, Socket } from 'socket.io-client';
import Header from "../components/Header";
import "../styles/Pong.css";
import Game from "../components/Game";
import Watch from "./Watch";
import { GameState, IRoom, User } from "../gameObjects/GameObject";
import ClientSocket from "../com/client-socket";
import useDatabase from "../com/use-database";

let socket: Socket;

export type onGoingGame = {
  roomId: string;
  playerOne: string;
  playerTwo: string;
};

function Pong() {
  const db = useDatabase();
  const [play, setPlay] = useState<boolean>(false);
  const [watch, setWatch] = useState<boolean>(false);
  const [inQueue, setInQueue] = useState<boolean>(false);
  const [room, setRoom] = useState<IRoom | null>(null);
  const [currentGames, setCurrentGames] = useState<onGoingGame[]>([]);

  let roomData: IRoom;
  let user: User;

  const quitGame = () => {
    socket.emit("forceDisconnection");
    setPlay(false);
    setRoom(null);
  }

  const joinQueue = (e: React.MouseEvent<HTMLButtonElement>) => {
    socket.emit('joinQueue', e.currentTarget.value);
  }

  const leaveQueue = () => {
    socket.emit("leaveQueue");
    setWatch(false);
  }

  const handleWatch = () => {
    setWatch(true);
  }

  const quitWatch = () => {
    setWatch(false);
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

    socket = ClientSocket;

    socket.emit("handleUserConnect", user); // user is gonna be the user from chat if needed 

    socket.emit("getCurrentGames");

    socket.on("updateCurrentGames", (currentGamesData: IRoom[]) => {
      updateCurrentGames(currentGamesData);
    });

    socket.on("newRoom", (newRoomData: IRoom) => {
      if (newRoomData.gameState === GameState.WAITING && user.id != newRoomData.playerOne.user.id) {
        return;
      }
      socket.emit("joinRoom", newRoomData.roomId);
      roomData = newRoomData;
      setRoom(roomData);
      setInQueue(false);
    });

    socket.on("joinedQueue", () => {
      setInQueue(true);
    });

    socket.on("leavedQueue", () => {
      setInQueue(false);
    });

    socket.on("joinedRoom", () => {
      setPlay(true);
    });

    socket.on("leavedRoom", () => {
      setPlay(false);
      setRoom(null);
    });

    socket.on("lost connection", () => {
      socket.emit("forceDisconnection");
      setPlay(false);
      setRoom(null);
    })
  }, []);

  return (
    <Fragment>
      {!play && !inQueue && <Header />}
      {play && 
      <button
        className="quit_button"
        value={'quit'}
        onClick={quitGame}
        type="button">
        QUIT
            </button>
      }
      {watch && !play && 
      <button
        className="quit_button"
        value={'quit'}
        onClick={quitWatch}
        type="button">
        QUIT
            </button>
      }
      <div id='pong_0' className="Pong">
        {!play && inQueue && !watch && (
          <button
            value={'colors'}
            type="button"
            className="play_button"
            onClick={leaveQueue}            // create room on the onClick
          >
            Leave
          </button>
        )}
        {!play && !inQueue && !watch && (
          <button
            value={'speed'}
            type="button"
            className="play_button"
            onClick={joinQueue}            // create room on the onClick
          >
            Speed
          </button>)}
        {!play && !inQueue && !watch && (
          <button
            onClick={joinQueue}
            value={'classic'}
            type="button"
            className="play_button"
          >
            Classic
          </button>
        )}
        {!play && !inQueue && !watch && (
          <button
            value={'colors'}
            type="button"
            className="play_button"
            onClick={joinQueue}            // create room on the onClick
          >
            Colors
          </button>
        )}
        {!play && !inQueue && !watch && (
          <button
            value={'watch'}
            type="button"
            className="watch_button"
            onClick={handleWatch}            // create room on the onClick
          >
            Watch
          </button>
        )}
        {play && <Game socketProps={socket} roomProps={room}></Game>}
        {watch && !play && <Watch currentGamesProps={currentGames} socketProps={socket}></Watch>}
      </div>
    </Fragment>
  );
}

export default Pong;
