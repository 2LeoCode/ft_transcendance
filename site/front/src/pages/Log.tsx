import React, { useState } from "react";
import "../styles/Log.css";
import { NavLink } from "react-router-dom";
import SignUp from "../components/SignUp";

function Log() {

  const [log, setLog] = useState(false);

  return (
    <div className="Log">
      {log && <SignUp />}
      <h1>Fight Pong</h1>
      {/* <NavLink to="/pong"> */}
        <button type="button" onClick={() => setLog(true)}>
          Sign in
        </button>
      {/* </NavLink> */}
    </div>
  );
}

export default Log;
