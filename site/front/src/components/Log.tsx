import React from "react";
import "../styles/Log.css";

function Log({log}: any) {
  return (
    <div className="Log">
        <h1>Fight Pong</h1>
        <button type="button" onClick={() => log(true)}>Sign in</button>
    </div>
  );
}

export default Log;