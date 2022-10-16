import React from "react";
import "../styles/Header.css";

function Header(props: any) {
  return (
    <div className="Header">
      <button
        className="infos_user"
        type="button"
        onClick={() => {
          props.chat(false);
          props.stat(true);
        }}
      >
        <img height="50%" src="./default-avatar.webp" alt="avatar" />
        <p>name</p>
      </button>
      <p></p>
      <button
        type="button"
        onClick={() => {
          props.chat(false);
          props.stat(false);
        }}
      >
        <h1>FIGHT PONG</h1>
      </button>
      <button
        type="button"
        onClick={() => {
          props.chat(true);
          props.stat(false);
        }}
      >
        Chat
      </button>
      <div className="menu">
        <ul></ul>
      </div>
    </div>
  );
}

export default Header;
