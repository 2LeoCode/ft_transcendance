import React, { useRef, useState, useEffect } from "react";
import { io } from "socket.io-client"
import { waitFor } from "@testing-library/react";
import { Draw } from "../gameObjects/Draw";
import { GameMode, GameState, IRoom } from "../gameObjects/GameObject";
import { drawerClasses } from "@mui/material";
import { request } from "https";

let oldTimestamp = 0;
const secondElapsed = 0;
let elapsed = 0;
let timestamp = getCurrentTime();

function getCurrentTime() {
	const date: number = Date.now();
	return date;
}

function vw_to_px(vw: number) {
  return (window.innerWidth * vw) / 100;
}

function vh_to_px(vh: number) {
  return (window.innerHeight * vh) / 100;
}

const socket = io("http://localhost:2000");
socket.emit("message", "coucou");
socket.on("message", (message) => {
  //console.log(message);
});

function Game() {
    
  const ref = useRef(null);
  const animateRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [width, setWitdh] = useState<number | any>(vw_to_px(70));
  const [height, setHeight] = useState<number | any>(vh_to_px(50));
  let cId:string;

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

      //if not a spectator "if(isPlayer) {"
    document.addEventListener("keydown", function (e) {
      if (e.code == "ArrowUp") {
        socket.emit('ArrowUp pressed', cId);
      }
      if (e.code == "ArrowDown") {
        socket.emit('ArrowDown pressed', cId);
      }
    });
    document.addEventListener("keyup", function (e) {
      if (e.code == "ArrowUp") {
        socket.emit('ArrowUp released', cId);
      }
      if (e.code == "ArrowDown") {
        socket.emit('ArrowDown released', cId);
      }
    })

    socket.on('updateRoom', function(updateRoom: string) {
      // don't know but might be useful...
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

        if (elapsed > 60) {
          socket.emit("requestUpdate");
          oldTimestamp = timestamp;
        } else {
          draw.draw();
        }
  
        socket.on("updatedRoom", ({ x, y }) => {
          draw.ball.x = x;
          draw.ball.y = y;
        });
        socket.on('update paddle1', ({ x, y, ballx, bally }) => {
          draw.player1.x = x;
          draw.player1.y = y;
          draw.ball.x = ballx;
          draw.ball.y = bally;
        })
        socket.on('update paddle2', ({ x, y, ballx, bally }) => {
          draw.player2.x = x;
          draw.player2.y = y;
          draw.ball.x = ballx;
          draw.ball.y = bally;
        })

        // console.log("gameLoop draw");

        animationFrameId = requestAnimationFrame(gameLoop);

      }
      
      gameLoop();

      return () => {
        window.cancelAnimationFrame(animationFrameId);
        //if (true) {
          // window.removeEventListener("keydown");
          // window.removeEventListener("keyup", function(){});
        //}
      };
  })

  socket.on('2 players', (clientId) => {
    console.log('2 players in front');
  });

  return <canvas ref={canvasRef} width={width} height={height}></canvas>;
}

export default Game;
