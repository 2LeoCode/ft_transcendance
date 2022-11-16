import React, { useState, useEffect } from "react";
import { UserCom } from "../com/user.com";
import Header from "../components/Header";
import { user_infos } from "../components/SignUp";
import "../styles/User.css";

declare var Blob: {
  prototype: Blob;
  new (): Blob;
  new (request: any, mime: string): Blob;
};

function OtherUser(props: any) {
  const matches_won: number = 0;
  const matches_lost: number = 0;

  return (
    <div>
      <Header />
      <div className="User">
        <h3>{props.name}</h3>
        <div className="avatar">
            <img src="./default-avatar.webp" alt="Avatar" width="80%" />
          <br />
        </div>
        <div className="stats">
          <p className="win">{matches_won} win</p>
          <p className="lose">{matches_lost} lose</p>
        </div>
        <div className="match_history">
          <h4>History</h4>
          <p>No match history yet</p>
        </div>
      </div>
    </div>
  );
}

export default OtherUser;
