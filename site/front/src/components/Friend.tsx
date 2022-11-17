import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Chat.css";
import "../styles/Friend.css";

function Friend(props: any) {
  function printInfos(name: string) {
    document.getElementById(name)!.style.display = "block";
  }

  function closeInfos(name: string) {
    document.getElementById(name)!.style.display = "none";
  }
  return (
    <li>
      <div onClick={() => printInfos(props.name)}>
        <img src="./default-avatar.webp" alt="Avatar" width="20px" />
        {props.name}
      </div>
      <div className="infos" id={props.name}>
        <button>Chat</button>
        <br />
        <button>Play</button>
        <br />
        <Link to={`/other_user/${props.name}`}>
          <button>View profile</button>
        </Link>
        <br />
        <button onClick={() => closeInfos(props.name)}>Close</button>
      </div>
    </li>
  );
}

export default Friend;
