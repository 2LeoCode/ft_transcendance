import React, { useRef, useState, useEffect } from "react";
import { io } from "socket.io-client"
import { waitFor } from "@testing-library/react";
import { Draw } from "../gameObjects/Draw";
import { GameMode, GameState, IRoom } from "../gameObjects/GameObject";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [width, setWitdh] = useState<number | any>(vw_to_px(70));
  const [height, setHeight] = useState<number | any>(vh_to_px(50));
  let cId:string;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return ;
    }
    console.log(canvas + " <= this is the canvas");
    const draw = new Draw(canvas);
  

    socket.on('update paddle1', ({ x, y, ballx, bally }) => {
      draw.player1.x = x;
      draw.player1.y = y;
      draw.ball.x = ballx;
      draw.ball.y = bally;
      draw.draw();
      // console.log("x = " + x + " & y = " + y);
    })
    socket.on('update paddle2', ({ x, y, ballx, bally }) => {
      draw.player2.x = x;
      draw.player2.y = y;
      draw.ball.x = ballx;
      draw.ball.y = bally;
      draw.draw();
      // console.log("x = " + x + " & y = " + y);
    })
  })

  window.addEventListener("resize", () => {
    setWitdh(vw_to_px(70));
    setHeight(vh_to_px(50));
  });

  socket.emit('client connected');
  socket.on('room joined', (clientId) => {
    cId = clientId;
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
    });
    // document.addEventListener("keydown", function (e) {
    //   if (e.code == "ArrowDown") {
    //     socket.emit('ArrowDown pressed', cId);
    //   }
    // });
    // document.addEventListener("keyup", function (e) {
    //   if (e.code == "ArrowDown") {
    //     socket.emit('ArrowDown released', cId);
    //   }
    // });
  })

  return <canvas ref={canvasRef} width={width} height={height}></canvas>;
}

export default Game;
