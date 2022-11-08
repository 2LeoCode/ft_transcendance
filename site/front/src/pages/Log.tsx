import React from "react";
import "../styles/Log.css";
import { NavLink } from "react-router-dom";
import SignUp from "../components/SignUp";

function Log({ log }: any) {
  return (
    <div className="Log">
      <h1>Fight Pong</h1>
      <NavLink to="/pong">
        <button type="button">
          Sign in
        </button>
      </NavLink>
      {/* <SignUp /> */}
    </div>
  );
}

export default Log;
