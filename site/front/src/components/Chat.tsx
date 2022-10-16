import React from "react";
import "../styles/Chat.scss";

function Chat() {
  return (
    <div className="Chat">
      <div className="left-pannel">
		<p>Create Channel</p>
	  </div>
      <div className="main">
		<div className="write_msg">
			<p>Your Message</p>
		</div>
	  </div>
      <div className="right-pannel">
		<p>Friends</p>
	  </div>
    </div>
  );
}

export default Chat;
