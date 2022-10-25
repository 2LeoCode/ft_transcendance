import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Header.css";

function Header() {
  return (
    <div className="Header">
      <NavLink to="/user" className="infos_user">
        <img height="50%" src="./default-avatar.webp" alt="avatar" />
        <p>name</p>
      </NavLink>
      <NavLink to="/watch">
        <p className="watch">Watch</p>
      </NavLink>
      <NavLink to="/pong">
        <h1>FIGHT PONG</h1>
      </NavLink>
      <NavLink to="/chat">
        <p className="chat">Chat</p>
      </NavLink>
      <div className="dropdown">
        <button className="dropbtn">Menu</button>
        <div className="dropdown-content">
          <button>Settings</button>
          <button>Link 2</button>
          <NavLink to="/">
            <button type="button">Logout</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Header;
