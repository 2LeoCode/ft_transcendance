import React, { useState } from "react";


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
	  document.addEventListener("keydown", function (e) {
		if (e.code == "KeyW") {
		  console.log("w pressed");
		}
	  });
  return (
    <canvas
            id="pong"
            width={width}
            height={height}
          ></canvas>
  );
}

export default Game;