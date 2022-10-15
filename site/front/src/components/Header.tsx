import React from "react";
import "../styles/Header.css";

function Header() {
  return (
    <div className="Header">
      <div className="infos_user">
        <img height="50%" src="./default-avatar.webp" alt="avatar" />
        <p>name</p>
      </div>
      <h1>FIGHT PONG</h1>
      <div className="menu">
        <ul></ul>
      </div>
    </div>
  );
}

export default Header;
