import React, { useState } from "react";
import "../styles/Log.css";
import SignUp from "../components/SignUp";

function Log() {

  const [log, setLog] = useState(false);

  return (
    <div className="Log">
      {log && <SignUp />}
      <h1>Fight Pong</h1>
        <button type="button" onClick={() => setLog(true)}>
          Sign in
        </button>
    </div>
  );
}

export default Log;
