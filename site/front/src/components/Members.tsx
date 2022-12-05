import React, { useState } from "react";
import { Link } from "react-router-dom";
import { io, Socket } from 'socket.io-client';
import "../styles/Chat.css";
import "../styles/Friend.css";

const Members: React.FC<{socketProps: Socket, name:string, setName:any, setter:any, socketId: string}> = ({socketProps, name, setName, setter, socketId}) => {
// function Members(props:{
//     socket:Socket,
//     name:string,
//     setName:any,
//     setter:any
// }) {
    
    const socket = socketProps;
  function printInfos(name: string) {
    document.getElementById(name)!.style.display = "block";
  }

  function closeInfos(name: string) {
    document.getElementById(name)!.style.display = "none";
  }

  function goDm(e: React.MouseEvent<HTMLButtonElement>) {
    console.log(socketId);
    socket.emit('DmRoom', socketId); // load dm room with e.currentTarget.value and socketProps.socketId
    console.log('goDm to ' + socketId);
    setName(socketId);
  }


  if (socket.id !== socketId) {
  return (
    <li>
      <div onClick={() => printInfos(name)}>
        <img src="./default-avatar.webp" alt="Avatar" width="20px" />
        {socketId}
      </div>
      <div className="infos" id={name}>
        <button value={socketProps.id} onClick={(e) => { goDm(e); setter(true); }}>Chat</button>
        <br />
        <button>Play</button>
        <br />
        <Link to={`/other_user/${name}`}>
          <button>View profile</button>
        </Link>
        <br />
        <button onClick={() => closeInfos(name)}>Close</button>
      </div>
    </li>
  );
    } else {
        return (
          <li>
            <div onClick={() => printInfos(name)}>
              <img src="./default-avatar.webp" alt="Avatar" width="20px" />
              You: {socketId}
            </div>
            <div className="infos" id={name}>
              <button value={socketProps.id} onClick={(e) => { goDm(e); setter(true); }}>Chat</button>
              <br />
              <button>Play</button>
              <br />
              <Link to={`/other_user/${name}`}>
                <button>View profile</button>
              </Link>
              <br />
              <button onClick={() => closeInfos(name)}>Close</button>
            </div>
          </li>
        );
    }
}

export default Members;
