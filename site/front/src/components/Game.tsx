import React, { useState, BaseHTMLAttributes } from "react";
import { io } from "socket.io-client";
import { waitFor } from "@testing-library/react";


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
  const [width, setWitdh] = useState<number | any>(vw_to_px(70));
  const [height, setHeight] = useState<number | any>(vh_to_px(50));
  let cId:string;
  window.addEventListener("resize", () => {
    setWitdh(vw_to_px(70));
    setHeight(vh_to_px(50));
  });

  function waitingLine() {

    socket.emit('client connected');
    socket.on('room joined', (clientId) => {
      cId = clientId;
      console.log("room joined " + clientId);
    })

    return <canvas id="pong" width={width} height={height}></canvas>;
  }

  document.addEventListener("keydown", function (e) {
    if (e.code == "ArrowUp") {
      socket.emit('ArrowUp pressed', cId);
      console.log("ArrowUp pressed");
    }
  });
  document.addEventListener("keyup", function (e) {
    if (e.code == "ArrowUp") {
      socket.emit('ArrowUp released', cId);
      console.log("ArrowUp released");
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.code == "ArrowDown") {
      socket.emit('ArrowDown pressed', cId);
      console.log("ArrowDown pressed");
    }
  });
  document.addEventListener("keyup", function (e) {
    if (e.code == "ArrowDown") {
      socket.emit('ArrowDown released', cId);
      console.log("ArrowDown released");
    }
  });
  return waitingLine();
}

export default Game;
