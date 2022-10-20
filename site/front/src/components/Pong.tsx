import React, { useEffect, useState } from "react";
import "../styles/Pong.css";

function vw_to_px(vw: number)
{
  return (window.innerWidth * vw) / 100
}

function vh_to_px(vh: number)
{
  return (window.innerHeight * vh) / 100
}

function Pong() {
  const [width, setWitdh] = useState<number | any>();
  const [height, setHeight] = useState<number | any>();
  useEffect(() => {
    setWitdh(vw_to_px(70));
    setHeight(vh_to_px(50));
  }, [window.innerWidth, window.innerHeight])
  const script = document.createElement("script");
   useEffect(() => {

    script.src = "./game.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <div className="Pong">
      <canvas id="pong" width={width} height={height}></canvas>
    </div>
  );
}

export default Pong;
