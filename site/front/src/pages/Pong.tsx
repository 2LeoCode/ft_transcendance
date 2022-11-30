import React, { useState } from "react";
// import ReactJS from "react";
import Header from "../components/Header";
import "../styles/Pong.css";
import Game from "../components/Game";

function Pong() {
  // const [isReady, setIsReady] = useState<boolean | any>(false);
  const [play, setPlay] = useState<boolean>(false);

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
