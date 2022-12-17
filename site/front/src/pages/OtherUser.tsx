import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import "../styles/User.css";
import { atom, useAtom } from "jotai";
import { Database } from "../com/database";
import useDatabase from "../com/use-database";
import ClientSocket from "../com/client-socket";
import { Socket } from "socket.io-client";

let socket: Socket

declare const Blob: {
  prototype: Blob;
  new(): Blob;
  new(request: any, mime: string): Blob;
};

function OtherUser() {

  socket = ClientSocket;

  const [image, setImage] = useState(new Blob());
  const [uploaded, setUploaded] = useState(false);
  const params = useParams();
  const username = params.userName;

  function inviteFriend(e: React.MouseEvent<HTMLButtonElement>) {
    const friendName = e.currentTarget.value;
    console.log(friendName);
    socket.emit("friendRequest", friendName);
  }

  return (
    <div>
      <Header />
      <div className="User">
        <h3>{username}</h3>
        <div className="avatar">
            <img src="./default-avatar.webp"  alt="Avatar" width="80%" />
          <br />
        </div>
        <div className="match_history">
          <button 
            value={username}
            onClick={inviteFriend}
            >
            Add Friend
          </button>
          {/* <p>No match history yet</p> */}
        </div>
      </div>
    </div>
  );
}

export default OtherUser;
