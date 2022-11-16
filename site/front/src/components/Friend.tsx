import React, { useState } from "react";
import { isPropertySignature } from "typescript";
import "../styles/Chat.css";

function Friend(props :any) {
  return (
    <li>
      <div className="status online"></div>
      <img src="./default-avatar.webp" alt="Avatar" width="20px" />
      {props.name}
    </li>
  );
}

export default Friend;
