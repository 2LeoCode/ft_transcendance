import React from "react";
import "../styles/Chat.scss";

function Chat() {
  return (
    <div className="Chat">
      <div className="left-pannel">
        <p>Create Channel</p>
        <p>Channels</p>
        <ul>
          <li>Channel 1</li>
          <li>Channel 2</li>
          <li>Channel 3</li>
        </ul>
        <p>Admins</p>
        <p>Members</p>
      </div>
      <div className="main">
        <ul>
          <li className="own_message">Message 1</li>
          <li className="other_message">Message 2</li>
          <li className="own_message">Message 3</li>
          <li className="other_message">Message 4</li>
        </ul>
      </div>
      <div className="write_msg">
        <form action="">
          <input type="text" placeholder="Message..." />
          <button type="submit">Send</button>
        </form>
      </div>
      <div className="right-pannel">
        <p>Friends</p>
      </div>
    </div>
  );
}

export default Chat;
