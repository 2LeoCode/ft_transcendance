import React from "react";
import "../styles/Log.css";
import { NavLink } from "react-router-dom";

function Log({ log }: any) {
  return (
    <div className="Log">
      <h1>Fight Pong</h1>
      <NavLink to="/pong">
        <button type="button">
          Sign in
        </button>
      </NavLink>
    </div>
  );
}

export default Log;
