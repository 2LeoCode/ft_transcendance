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

  const goDm = (e: React.MouseEvent<HTMLDivElement>) => {
      // socketProps.emit("spectateRoom", e.currentTarget.value);
    console.log("goDm to " + e.currentTarget);
    }
  return (
    <div>
      <h3>Members</h3>
      <div className="Members">
      {users.map((user) => {
        return (
          <div
            key={user.socketId}
            onClick={goDm}
          >
            {user.socketId}
          </div>

        )}
      )}
      </div>
    </div>
  );
}

export default Members;
