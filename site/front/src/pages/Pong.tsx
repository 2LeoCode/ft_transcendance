import React, { useState } from "react";
import ReactJS from "react";
import Header from "../components/Header";
import "../styles/Pong.css";
import Game from "../components/Game";
 

function activate_script() {
  const script = document.createElement("script");
  script.src = "./game.js";
  script.async = true;
  document.body.appendChild(script);
}

function Pong() {
  const [isReady, setIsReady] = useState<boolean | any>(false);
  const [play, setPlay] = useState<boolean | any>(false);

  return (
    <div>
      <Header />
      <div className="Pong">
        {!play && (
          <button
            type="button"
            className="play_button"
            onClick={() => {            // create room on the onClick
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
