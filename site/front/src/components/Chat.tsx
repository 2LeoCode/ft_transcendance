import React from "react";
import "../styles/Chat.scss";

function Chat() {
  return (
    <div className="Chat">
      <div className="left-pannel">
        <h3>Channels</h3>
        <ul>
          <li>Channel 1</li>
          <li>Channel 2</li>
          <li>Channel 3</li>
        </ul>
        <h3>Admins</h3>
        <ul>
          <li>Admin 1</li>
        </ul>
        <h3>Members</h3>
        <ul>
          <li>Member 1</li>
          <li>Member 2</li>
          <li>Member 3</li>
        </ul>
        <h4 className="create_channel">Create Channel</h4>
      </div>
      <ul className="main">
        <li className="own_message">Message 1</li>
        <li className="other_message">Message 2</li>
        <li className="own_message">Message 3</li>
        <li className="other_message">Message plus long 4</li>
      </ul>
      <div className="write_msg">
        <form action="">
          <input type="text" placeholder="Message..." />
          <button type="submit">Send</button>
        </form>
      </div>
      <div className="right-pannel">
        <h3>Friends</h3>
        <ul>
          <li>Friend 1</li>
          <li>Friend 2</li>
          <li>Friend 3</li>
        </ul>
      </div>
    </div>
  );
}

export default Chat;
