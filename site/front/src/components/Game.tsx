import React, { useState } from "react";
import { Server, Socket } from 'socket.io';

const io = new Server()

function vw_to_px(vw: number) {
  return (window.innerWidth * vw) / 100;
}

function vh_to_px(vh: number) {
  return (window.innerHeight * vh) / 100;
}

function Game() {
  const [width, setWitdh] = useState<number | any>(vw_to_px(70));
  const [height, setHeight] = useState<number | any>(vh_to_px(50));
  window.addEventListener("resize", () => {
    setWitdh(vw_to_px(70));
    setHeight(vh_to_px(50));
  });
  // Key W
  // document.addEventListener("keydown", function (e) {
  //   if (e.code == "KeyW") {
  //     console.log("w pressed");
  //   }
  // });
  // document.addEventListener("keyup", function (e) {
  //   if (e.code == "KeyW") {
  //     console.log("w released");
  //   }
  // });
  // // Key S
  // document.addEventListener("keydown", function (e) {
  //   if (e.code == "KeyS") {
  //     console.log("s pressed");
  //   }
  // });
  // document.addEventListener("keyup", function (e) {
  //   if (e.code == "KeyS") {
  //     console.log("s released");
  //   }
  // });
  // Arrow up
  document.addEventListener("keyup", function (e) {
    if (e.code == "ArrowUp") {
      io.emit("keyUp", e.code);
      console.log("ArrowUp released");
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.code == "ArrowUp") {
      console.log("ArrowUp pressed");
    }
  });
  // Arrow down
  document.addEventListener("keyup", function (e) {
    if (e.code == "ArrowDown") {
      console.log("ArrowDown released");
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.code == "ArrowDown") {
      console.log("ArrowDown pressed");
    }
  });
  return <canvas id="pong" width={width} height={height}></canvas>;
}

export default Game;
