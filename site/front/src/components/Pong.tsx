import React, { useEffect } from "react";
import "../styles/Pong.css";

function Pong() {
  return (
    <div className="Pong">
		Game
      <canvas id="pong" width="700" height="400"></canvas>
    </div>
  );
}

export default Pong;
