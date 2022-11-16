import React, { useState } from "react";
import OtherUser from "../pages/OtherUser";
import "../styles/Chat.css";
import "../styles/Friend.css";

function printInfos()
{
  document.getElementById('infos')!.style.display = "block";
}

function closeInfos()
{
  document.getElementById('infos')!.style.display = "none";
}

function Friend(props :any) {
  return (
    <li >
      <div onClick={printInfos}>
      <img src="./default-avatar.webp" alt="Avatar" width="20px" />
      {props.name}
      </div>
      <div className="infos" id="infos">
        <button>Chat</button><br />
        <button>Play</button><br />
        <button onClick={ () => {return <OtherUser name={props.name} />}}>View profile</button><br />
        <button onClick={closeInfos}>Close</button>
      </div>
    </li>
  );
}

export default Friend;
