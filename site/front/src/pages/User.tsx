import { atom, useAtom } from "jotai";
import React, { useState, useEffect } from "react";
import { useLocation, Location, Link } from "react-router-dom";
import ClientSocket from "../com/client-socket";
import useDatabase from "../com/use-database";
import Header from "../components/Header";
import "../styles/User.css";

declare let Blob: {
  prototype: Blob;
  new(): Blob;
  new(request: any, mime: string): Blob;
};

function User() {

  const Database = useDatabase();
  const location = useLocation();

  const [image, setImage] = useState(new Blob());
  const [uploaded, setUploaded] = useState(false);
  const [nick] = useAtom(Database.user.nickAtom);
  const [scores] = useAtom(Database.user.scoresAtom);
  const [friends] = useAtom(Database.user.friendsAtom);
  const [requestedFriends] = useAtom(Database.user.friendRequestsAtom);
  const [win, setWin] = useState(0);
  const [tie, setTie] = useState(0);
  const [lose, setLose] = useState(0);
  let matches_won: number;
  let matches_lost: number;
  let matches_tie: number;

  function acceptFriendRequest(e: React.MouseEvent<HTMLButtonElement>) {
    const friendName = e.currentTarget.value;
    ClientSocket.emit("acceptFriendRequest", friendName);
  }

  function declineFriendRequest(e: React.MouseEvent<HTMLButtonElement>) {
    const friendName = e.currentTarget.value;
    ClientSocket.emit("declineFriendRequest", friendName);
  }

  useEffect(() => {

    matches_lost = 0;
    matches_won = 0;
    matches_tie = 0;

    scores.map((score) => {
      if (score.playerScore > score.enemyScore)
        matches_won++;
      else if (score.playerScore < score.enemyScore)
        matches_lost++;
      else
        matches_tie++;
    })

    setWin(matches_won);
    setLose(matches_lost);
    setTie(matches_tie);

  }, [friends])

  return (
    <div>
      <Header />
      <div className="User">
        <h3>{nick}</h3>
        <div className="avatar">
          {!uploaded && (
            <img src="./default-avatar.webp" alt="Avatar" width="80%" />
          )}
          {uploaded && (
            <img src={URL.createObjectURL(image)} alt="Avatar" width="80%" />
          )}
          <br />
          <label htmlFor="avatar" className="avatar_label">
            Change avatar
          </label>
          <input
            id="avatar"
            className="avatar_button"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) setImage(e.target.files[0]);
              setUploaded(true);
            }}
          />
        </div>
        <div className="stats">
          <p key={"Win"} className="win">{win} Win</p>
          <p key={"Tie"} className="tie">{tie} Tie</p>
          <p key={"Loseeeeee"} className="lose">{lose} Lose</p>
        </div>
        <div className="requested_friends">
          <h4>Friends Requests</h4>
          {requestedFriends.map((friend, i) => {
            return (
              <p key={i}>
                {friend.user42}
                <button
                  value={friend.user42}
                  onClick={acceptFriendRequest}>
                  Accept
                </button>
                <button
                  value={friend.user42}
                  onClick={declineFriendRequest}>
                  Decline
                </button>
              </p>
            )
          })}
        </div>
        <div className="friends">
          <h4>Friends</h4>
          {friends.map((friend, i) => {
            let status = "offline";
            if (friend.online)
              status = "online";
            return (
              <Link key={i} to={`/other_user/${friend.user42}`}>
                <ul>{friend.user42}-{status}</ul>
              </Link>
            )
          })}
        </div>
        <div className="match_history">
          <h4>History</h4>
          {scores.map((score, i) => {
            return (
              <ul key={i}>{score.playerScore} - {score.enemyScore}</ul>
            )
          })}
        </div>
      </div>
    </div>
  );
}

export default User;
