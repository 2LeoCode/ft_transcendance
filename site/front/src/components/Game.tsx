import React, { useState } from "react";
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
  window.addEventListener("resize", () => {
    setWitdh(vw_to_px(70));
    setHeight(vh_to_px(50));
  });

  function waitingLine() {

    socket.emit('client connected', "in game");
    socket.on('client connected', (clientId) => {
      console.log("client: " + clientId + " is connected to the front.");
      socket.emit("join room", clientId);
    })
    
  }

  waitingLine();
  document.addEventListener("keydown", function (e) {
    if (e.code == "ArrowUp") {
      console.log("ArrowUp pressed");
    }
  });
  document.addEventListener("keyup", function (e) {
    if (e.code == "ArrowUp") {
      console.log("ArrowUp released");
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.code == "ArrowDown") {
      console.log("ArrowDown pressed");
    }
  });
  document.addEventListener("keyup", function (e) {
    if (e.code == "ArrowDown") {
      console.log("ArrowDown released");
    }
  });
  return <canvas id="pong" width={width} height={height}></canvas>;
}

export default Game;
