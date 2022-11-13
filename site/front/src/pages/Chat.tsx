import React from "react";
import Header from "../components/Header";
import Channels from "../components/Channels";
import "../styles/Chat.scss";
import OnlineUsers from "../components/OnlineUsers";
import Messages from "../components/Messages";

function Chat() {
  return (
    <div>
      <Header />
      <div className="Chat">
        <div className="left-pannel">
          <Channels />
          <h3>Admins</h3>
          <ul className="admins">
            <li>
              <div className="status online"></div>
              <img src="./default-avatar.webp" alt="Avatar" width="20px" />
              Admin 1
            </li>
          </ul>
          <OnlineUsers />
        </div>
        <ul className="main">
          <Messages />
        </ul>
        <div className="write_msg">
          <form action="">
            <input type="text" placeholder="Message..." />
            <button type="submit">Send</button>
          </form>
        </div>
        <div className="right-pannel">
          <h3>Friends</h3>
          <ul className="friends">
            <li>
              <div className="status online"></div>
              <img src="./default-avatar.webp" alt="Avatar" width="20px" />
              Friend 1
            </li>
            <li>
              <div className="status online"></div>
              <img src="./default-avatar.webp" alt="Avatar" width="20px" />
              Friend 2
            </li>
            <li>
              <div className="status online"></div>
              <img src="./default-avatar.webp" alt="Avatar" width="20px" />
              Friend 3
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Chat;
