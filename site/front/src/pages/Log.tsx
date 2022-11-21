import React, { useState } from "react";
import "../styles/Log.css";
import SignUp from "../components/SignUp";
import SignIn from "../components/SignIn";

function Log() {
  const [log, setLog] = useState(false);
  const [log2, setLog2] = useState(false);
  return (
    <div className="Log">
      {log && <SignUp />}
      {log2 && <SignIn />}
      <h1>Fight Pong</h1>
      <button type="button" onClick={() => setLog2(true)}>
        Sign In
      </button>
      <br />
      <br />
      <button type="button" onClick={() => setLog(true)}>
        Sign Up
      </button>
    </div>
  );
}

export default Log;
