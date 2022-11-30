import React, { useContext } from "react";
import "../styles/Log.css";
import { NavLink } from "react-router-dom";

function Log() {
  return (
    <div className="Log">
      <h1>Fight Pong</h1>
      <button type="button" onClick={() => {
        window.location.replace('http://localhost:2000/auth/login');
        }}>
        Sign In
      </button>
    </div>
  );
}

export default Log;
