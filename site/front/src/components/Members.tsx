import React, { useEffect, useState } from "react";
import { Socket } from 'socket.io-client';
import "../styles/Watch.css";
import { IRoom, User } from "../gameObjects/GameObject";

// export type currentUserConnected = {
// 	roomId: string;
// 	playerOne: string;
// 	playerTwo: string;
// };

const Members: React.FC<{currentUsers: User[], socketProps: Socket}> = ({currentUsers, socketProps}) => {
  const users: User[] = currentUsers;
  const socket: Socket = socketProps;

  const goDm = (e: React.MouseEvent<HTMLButtonElement>) => {
    socketProps.emit("DmRoom", e.currentTarget.value); // load dm room with e.currentTarget.value and socketProps.socketId
    console.log("goDm to " + e.currentTarget.value);
  }

  return (
    <div>
      <h3>Members</h3>
      <div className="Members">
      {users.map((user) => {
        if (socket && socket.id === user.socketId) {
        return (
          <button
            key={user.socketId}
            value={user.socketId}
          >
            You: {user.socketId}
          </button>)
        } else {
          return (
            <button
              key={user.socketId}
              value={user.socketId}
              onClick={goDm}
            >
              {user.socketId}
            </button>)
        }

        }
      )}
      </div>
    </div>
  );
}

export default Members;
