import React, { useState } from "react";
import Header from "../components/Header";
import "../styles/Pong.css";
import { io } from "socket.io-client";
import Game from "../components/Game";

function activate_script() {
  const script = document.createElement("script");
  script.src = "./game.js";
  script.async = true;
  document.body.appendChild(script);
}

function Pong() {
  const [play, setPlay] = useState<boolean | any>(false);

  const socket = io("http://localhost:2000");
  socket.on("message", (msg) => {
    console.log(msg);
  });
  return (
    <div>
      <Header />
      <div className="Pong">
        {!play && (
          <button
            type="button"
            className="play_button"
            onClick={() => {
              setPlay(true);
              activate_script();
            }}
          >
            Play
          </button>
        )}
        {play && <Game />}
      </div>
    </div>
  );
}

export default Pong;
