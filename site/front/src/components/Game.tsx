import React, { useRef, useState, useEffect } from "react";
import { Socket } from "socket.io-client"
import { Draw } from "../gameObjects/Draw";
import { IRoom } from "../gameObjects/GameObject";


const Game: React.FC<{ socketProps: Socket, roomProps: any }> = ({ socketProps, roomProps }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const socket: Socket = socketProps;
  let room: IRoom = roomProps;
  const roomId: string | undefined = room?.roomId;

  let endGame = false;

  const [width, setWitdh] = useState<number>(vw_to_px(70));
  const [height, setHeight] = useState<number>(vh_to_px(50));

  const isAplayer = true; /*(room.playerOne.user.socketId == user.username || room.playerTwo.user.socketId == user.username);*/

  let oldTimestamp = 0;
  let elapsed = 0;
  let timestamp = getCurrentTime();

  // const leaveRoom = () => {
  // 	if (room.gameState === GameState.WAITING) {
  // 		room.gameState = GameState.STARTING;
  // 	}
  // 	socket.emit("leaveRoom", roomId);
  // }

  function getCurrentTime() {
    const date: number = Date.now();
    return date;
  }

  const downHandler = (event: KeyboardEvent): void => {
    socket.emit('keyDown', { roomId: roomId, key: event.key });
  };

  const upHandler = (event: KeyboardEvent): void => {
    socket.emit('keyUp', { roomId: roomId, key: event.key });
  };

  function vw_to_px(vw: number) {
    return (window.innerWidth * vw) / 100;
  }

  function vh_to_px(vh: number) {
    return (window.innerHeight * vh) / 100;
  }

  window.addEventListener("resize", () => {
    setWitdh(vw_to_px(70));
    setHeight(vh_to_px(50));
  });

  socket.emit('client connected');

  useEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    let animationFrameId: number;

    const draw = new Draw(canvas);
    draw.gameMode = room.mode;

    //if not a spectator
    if (isAplayer) {
      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);
    }


    socket.on('updateRoom', function (updatedRoom: string) {
      room = JSON.parse(updatedRoom);
      draw.ball.x = room.ball.x;
      draw.ball.y = room.ball.y;
      draw.player1.x = room.playerOne.x;
      draw.player1.y = room.playerOne.y;
      draw.player2.x = room.playerTwo.x;
      draw.player2.y = room.playerTwo.y;
      draw.playerScore = room.playerOne.score;
      draw.player2Score = room.playerTwo.score;
    });

    socket.on("winner", (username: string) => {
      draw.stopGame(username);
      endGame = true;
    })


    const gameLoop = () => {
      if (!endGame) {

        timestamp = getCurrentTime();
        elapsed = (timestamp - oldTimestamp);
        if (elapsed > 30) {
          socket.emit("requestUpdate", roomId);
          oldTimestamp = timestamp;
        }

        draw.draw();
        animationFrameId = requestAnimationFrame(gameLoop);

      }
    }

    gameLoop();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      if (isAplayer) {
        window.removeEventListener("keydown", downHandler);
        window.removeEventListener("keyup", upHandler);
      }
    };
  })

  return <canvas ref={canvasRef} width={width} height={height}></canvas>;
}

export default Game;
