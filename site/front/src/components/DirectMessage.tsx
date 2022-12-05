import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import '../styles/Chat.css';
import '../styles/Friend.css';

export type message = {
  content: string;
  author: string;
  index: number;
  className: string;
};

function DirectMessage(props: any) {
  const socket: Socket = props.socket;
//   const messages: message[] = [];
  const [messages, setMessages] = useState<message[]>([]);
  const [clientId, setClientId] = useState('');
useEffect( () => {

    socket.on('NewCreatedDm', (message: string, own:boolean) => {
    console.log('created dm ' + message);
    // setClientId(client.id);
    if (own === true) {
        setMessages(current => [...current, {
            content: message,
            author: 'tototest',
            index: 0,
            className: 'own_message'
        }]);
    } else {
        setMessages(current => [...current, {
            content: message,
            author: 'tototest',
            index: 0,
            className: 'other_message'
          }]);
    }
  });

}, [])

  

  return (
    <div className="DirectMessage">
      <div className="header">
        <h2>{props.name}</h2>
      </div>
      {messages.map((content, i) => {
        return <li key={i} className={messages[i].className}>{messages[i].content}</li>;
      })}
    </div>
  );
}

export default DirectMessage;
