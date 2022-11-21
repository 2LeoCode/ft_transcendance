import React, { useState } from "react";
import "../styles/Chat.css";

function Channel(props: any) {
  return (
    <div className="channel">
      <h3>Admins</h3>
      <ul className="admins">
        <li>
          <div className="status online"></div>
          <img src="./default-avatar.webp" alt="Avatar" width="20px" />
          Admin 1
        </li>
      </ul>
      <h3>Members</h3>
      <ul className="members">
        <li>
          <div className="status online"></div>
          <img src="./default-avatar.webp" alt="Avatar" width="20px" />
          Member 1
        </li>
        <li>
          <div className="status online"></div>
          <img src="./default-avatar.webp" alt="Avatar" width="20px" />
          Member 2
        </li>
        <li>
          <div className="status online"></div>
          <img src="./default-avatar.webp" alt="Avatar" width="20px" />
          Member 3
        </li>
      </ul>
    </div>
  );
}

export default Channel;
