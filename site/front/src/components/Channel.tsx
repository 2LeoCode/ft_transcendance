import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import '../styles/Chat.css';
import '../styles/Friend.css';

function Channel(props: any) {
  const socket: Socket = props.socket;

  socket.on('openCreatedChannel', (client: Socket) => {
    console.log('created channel');
  });

  return (
    <div className="DirectMessage">
      <div className="header">
        <h2>name of chat</h2>
      </div>
      <li className="own_message">Coucou from channel</li>
      <li className="other_message">Message 2</li>
      <li className="own_message">Message 3</li>
      <li className="other_message">Message plus long 4</li>
      <li className="other_message">
        Message beeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeaucoup plus long 5
      </li>
    </div>
  );
}

export default Channel;
