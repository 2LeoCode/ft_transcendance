import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import "../styles/User.css";
import { atom, useAtom } from "jotai";
import { Database } from "../com/database";
import useDatabase from "../com/use-database";

declare const Blob: {
  prototype: Blob;
  new(): Blob;
  new(request: any, mime: string): Blob;
};

function OtherUser() {

  const [image, setImage] = useState(new Blob());
  const [uploaded, setUploaded] = useState(false);
  const params = useParams();
  const username = params.userName;

  return (
    <div>
      <Header />
      <div className="User">
        <h3>{username}</h3>
        <div className="avatar">
            <img src="./default-avatar.webp" alt="Avatar" width="80%" />
          <br />
        </div>
        <div className="match_history">
          <button >Add Friend</button>
          {/* <p>No match history yet</p> */}
        </div>
      </div>
    </div>
  );
}

export default OtherUser;
