import React, { useEffect, useState } from "react";
import { Socket } from 'socket.io-client';
import Header from "../components/Header";
import "../styles/Watch.css";
import { onGoingGame } from '../pages/Pong';


const Watch: React.FC<{currentGamesProps: onGoingGame[], socketProps: Socket}> = ({currentGamesProps, socketProps}) => {
  const currentGames: onGoingGame[] = currentGamesProps;

  const spectate = (e: React.MouseEvent<HTMLButtonElement>) => {
      socketProps.emit("spectateRoom", e.currentTarget.value);
  }
  return (
    <div>
      <div className="Watch">
      {currentGames.map((room) => {
        return (
          <button
            key={room.roomId}
            value={room.roomId}
            type="button"
            className="play_button"
            onClick={spectate}            // create room on the onClick
          >
            {room.roomId}
          </button>

        )}
      )}
      </div>
    </div>
  );
}

export default Watch;
