import React, { useRef, useState, useEffect } from "react";
import { Socket } from "socket.io-client"
import { Draw } from "../gameObjects/Draw";
import { GameMode, GameState, IRoom } from "../gameObjects/GameObject";


const Game: React.FC<{socketProps: Socket, roomProps: any}> = ({socketProps, roomProps}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
    
  const socket: Socket = socketProps;
  let room: IRoom = roomProps;
	let   roomId: string | undefined = room?.roomId;
  const ref = useRef(null);
  const animateRef = useRef(0);

  console.log("canva is working...");

  const [width, setWitdh] = useState<number | any>(vw_to_px(70));
  const [height, setHeight] = useState<number | any>(vh_to_px(50));
	const [gameEnded, setGameEnded] = useState(false);
  
  // here we'll need to compare room players with user ids to check if in game or not
  let isAplayer: boolean = true; /*(room.playerOne.user.socketId == user.username || room.playerTwo.user.socketId == user.username);*/
  
  let cId:string;
  let oldTimestamp = 0;
  let elapsed = 0;
  let timestamp = getCurrentTime();

	const leaveRoom = () => {
		if (room.gameState === GameState.WAITING) {
			room.gameState = GameState.STARTING;
		}
		socket.emit("leaveRoom", roomId);
	}
  
  function getCurrentTime() {
    const date: number = Date.now();
    return date;
  }
  
  const downHandler = (event: KeyboardEvent): void => {
    socket.emit('keyDown', {roomId: roomId, key: event.key});
  };
  
  const upHandler = (event: KeyboardEvent): void => {
    socket.emit('keyUp', {roomId: roomId, key: event.key});
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
  socket.on('room joined', (clientId) => {
    cId = clientId;
  });



  useEffect(() => {

      const canvas = canvasRef.current;
      if (!canvas) {
        return ;
      }

      let animationFrameId: number;

      const draw = new Draw(canvas);
      console.log(room.mode);
      draw.gameMode = room.mode;

      //if not a spectator "if(isPlayer) {"
		if (isAplayer) {
      window.addEventListener("keydown", downHandler);
			window.addEventListener("keyup", upHandler);
    }


      socket.on('updateRoom', function(updatedRoom: string) {
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

    const waitForInvitedUser = () => {
      //same. We'll see
			// draw.drawLoading();
			// draw.drawWaiting();
    }
    
    const gameEnd = () => {
      //same. we'll see
    }


      const gameLoop = () => {

        timestamp = getCurrentTime();
        elapsed = (timestamp - oldTimestamp);
        // console.log(elapsed);

        if (elapsed > 30) {
          socket.emit("requestUpdate", roomId);
          oldTimestamp = timestamp;
        }
  
        // socket.on("updatedRoom", ({ x, y, paddle1x, paddle1y, paddle2x, paddle2y, score1, score2 }) => {
        //   draw.ball.x = x;
        //   draw.ball.y = y;
        //   draw.player1.x = paddle1x;
        //   draw.player1.y = paddle1y;
        //   draw.player2.x = paddle2x;
        //   draw.player2.y = paddle2y;
        //   draw.playerScore = score1;
        //   draw.player2Score = score2;
        // });
        if (draw.playerScore < 7 && draw.player2Score < 7)
          draw.draw();
        else {
          draw.stopGame(); // maybe do a endGame function to save everything in the db
          return ;
        }

        animationFrameId = requestAnimationFrame(gameLoop);

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

  socket.on('2 players', (clientId) => {
    console.log('2 players in front');
  });

  return <canvas ref={canvasRef} width={width} height={height}></canvas>;
}

export default Game;
