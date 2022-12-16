import React, { useState, useEffect, Fragment } from "react";
// import ReactJS from "react";
import { io, Socket } from 'socket.io-client';
import Header from "../components/Header";
import "../styles/Pong.css";
import Game from "../components/Game";
import Watch from "./Watch";
import { GameState, IRoom, User } from "../gameObjects/GameObject";
import ClientSocket from "../com/client-socket";
import useDatabase from "../com/use-database";
import { atom, useAtom } from "jotai";
import EntityParser from "../com/entity-parser";
//import { ChatWidthAtom } from "../components/chat/Chat";

let socket: Socket;

export type onGoingGame = {
  roomId: string;
  playerOne: string;
  playerTwo: string;
};

//export const MouseOnResizerAtom = atom(false);

function Pong() {
  const db = useDatabase();
  // const [isReady, setIsReady] = useState<boolean | any>(false);
  const [play, setPlay] = useState<boolean>(false);
  const [watch, setWatch] = useState<boolean>(false);
  const [inQueue, setInQueue] = useState<boolean>(false);
  const [room, setRoom] = useState<IRoom | null>(null);
  const [currentGames, setCurrentGames] = useState<onGoingGame[]>([]);

  let roomData: IRoom;
  // let roomId: string | undefined;
  let user: User;

  const quitGame = () => {
    // maybe emit to get the user out of the room...
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
    // console.log("handleWatch");
    setWatch(true);
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

    console.log('registering socket events...');
    socket = ClientSocket;

    socket.emit("handleUserConnect", user); // user is gonna be the user from chat if needed 

    socket.emit("getCurrentGames");

    socket.on("updateCurrentGames", (currentGamesData: IRoom[]) => {
      updateCurrentGames(currentGamesData);
    });

    socket.on("newRoom", (newRoomData: IRoom) => {
      if (newRoomData.gameState === GameState.WAITING && user.id != newRoomData.playerOne.user.id) {
        //console.log("return");
        return;
      }
      socket.emit("joinRoom", newRoomData.roomId);
      console.log("emit joinRoom");
      roomData = newRoomData;
      // roomId = newRoomData.roomId;
      setRoom(roomData);
      setInQueue(false);
    });

    socket.on("joinedQueue", () => {
      // console.log("joinQueue");
      setInQueue(true);
    });

    socket.on("leavedQueue", () => {
      setInQueue(false);
    });

    socket.on("joinedRoom", () => {
      //console.log("joined room");
      setPlay(true);
    });

    socket.on("leavedRoom", () => {
      // if (chatSocket) {
      // 	chatSocket.emit("userGameStatus", { isPlaying: false }); // user status "not playing"
      // }
      // roomId = undefined;
      setPlay(false);
      setRoom(null);
    });

    socket.on("lost connection", () => {
      socket.emit("forceDisconnection");
      setPlay(false);
      setRoom(null);
    })

    //  return () => {
    //      // if (chatSocket) {
    //      //   chatSocket.emit("userGameStatus", { isPlaying: false }); // user status
    //      // }
    //      if (socket) {
    //        console.log('err')
    //        socket.disconnect();
    //      }
    //    }
  }, []);


  //const [mouseOnResizer] = useAtom(MouseOnResizerAtom);
  //const [, setChatWidth] = useAtom(ChatWidthAtom);

  //const resizeChat = async (e: React.MouseEvent<HTMLDivElement>) => {
  //  if (!mouseOnResizer)
  //    return;
  //  if (mouseOnResizer) {
  //    console.log('resizeChat')
  //    const newWidth = (window.screenX - e.clientX) / window.screenX;
  //    
  //    console.log('newWidth: ' + newWidth);
  //    if (newWidth < 10 || newWidth > 100)
  //      return;
  //    //const chat = document.getElementById('chat_0')!;
  //    //chat.style.width = `${newWidth}%`;
  //    setChatWidth(newWidth);
  //  }
  //}

  return (
    //<div
    //    id='mouse_mask_0'
    //    onMouseMove={resizeChat}
    //    style={{ width: '100%', height: '100%'}}
    //>
    <Fragment>
      {!play && <Header />}
      {play && <button
        className="quit_button"
        value={'quit'}
        onClick={quitGame}
        type="button">
        Give up
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
            className="play_button"
            onClick={handleWatch}            // create room on the onClick
          >
            Watch
          </button>
        )}
        {play && <Game socketProps={socket} roomProps={room}></Game>}
        {watch && !play && <Watch currentGamesProps={currentGames} socketProps={socket}></Watch>}
      </div>
    </Fragment>
    // </div>
  );
}

export default Pong;
