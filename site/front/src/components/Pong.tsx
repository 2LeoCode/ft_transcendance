import React, { useEffect } from "react";
import "../styles/Pong.css";

function Pong() {
  // useEffect(() => {
  //   const script = document.createElement("script");

  //   script.src = "./game.js";
  //   script.async = true;

  //   document.body.appendChild(script);

  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);
  return (
    <div className="Pong">
      <canvas id="pong" width="700" height="400"></canvas>
    </div>
  );
}

export default Pong;
