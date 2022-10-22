import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "../styles/Pong.css";

function vw_to_px(vw: number) {
  return (window.innerWidth * vw) / 100;
}

function vh_to_px(vh: number) {
  return (window.innerHeight * vh) / 100;
}

function activate_script()
{
  // useEffect(() => {
    const script = document.createElement("script");
    script.src = "./game.js";
    script.async = true;
    document.body.appendChild(script);

  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);
}

function Pong() {
  const [width, setWitdh] = useState<number | any>(vw_to_px(70));
  const [height, setHeight] = useState<number | any>(vh_to_px(50));
  const [play, setPlay] = useState<boolean | any>(false);
  setInterval(() => setWitdh(vw_to_px(70)), 100);
  setInterval(() => setHeight(vh_to_px(50)), 100);

  
  return (
    <div>
      <Header />
      <div className="Pong">
        {!play && <button type="button" className="play_button" onClick={() => {setPlay(true); activate_script()}} >Play</button>}
        {play && <canvas id="pong" width={width} height={height}></canvas>}
      </div>
    </div>
  );
}

export default Pong;
