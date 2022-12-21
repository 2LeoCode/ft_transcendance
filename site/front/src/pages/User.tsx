import { atom, useAtom } from "jotai";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import ClientSocket from "../com/client-socket";
import useDatabase from "../com/use-database";
import Header from "../components/Header";
import "../styles/User.css";

//declare let Blob: {
//  prototype: Blob;
//  new(): Blob;
//  new(request: any, mime: string): Blob;
//};

function User() {

  const Database = useDatabase();
  // const location = useLocation();

  //const [image, setImage] = useState(new Blob());
  //const [uploaded, setUploaded] = useState(false);
  const [nick] = useAtom(Database.user.nickAtom);
  const [scores] = useAtom(Database.user.scoresAtom);
  const [friends, setFriends] = useAtom(Database.user.friendsAtom);
  const [requestedFriends] = useAtom(Database.user.friendRequestsAtom);
  const [win, setWin] = useState(0);
  const [tie, setTie] = useState(0);
  const [lose, setLose] = useState(0);
  const [ratio, setRatio] = useState("0");
  const [avatar] = useAtom(Database.user.avatarAtom);
  const [hasFriendRequest, setHasFriendRequest] = useState(false);

  function acceptFriendRequest(e: React.MouseEvent<HTMLButtonElement>) {
    const friendName = e.currentTarget.value;
    ClientSocket.emit("acceptFriendRequest", friendName);
  }

  function declineFriendRequest(e: React.MouseEvent<HTMLButtonElement>) {
    const friendName = e.currentTarget.value;
    ClientSocket.emit("declineFriendRequest", friendName);
  }

  useEffect(() => {

    ClientSocket.on("changeFriendStatus", (userName, isInGame: boolean) => {
      setFriends((friends) => {
        const newFriends = friends.map((friend) => {
          if (friend.user42 === userName) {
            friend.inGame = isInGame;
            friend.inGameAtom = atom(isInGame);
          }
          return friend;
        });
        return newFriends;
      });
    });

    ClientSocket.on("changeFriendOnline", (friendName, IsOnline) => {
      setFriends((friends) => {
        const newFriends = friends.map((friend) => {
          if (friend.user42 === friendName) {
            friend.online = IsOnline;
            friend.onlineAtom = atom(IsOnline);
          }
          return friend;
        });
        return newFriends;
      });
    });
    
    let matchWon = 0;
    let matchLost = 0;
    let matchTie = 0;

    scores.map((score) => {
      if (score.playerScore > score.enemyScore)
        matchWon++;
      else if (score.playerScore < score.enemyScore)
        matchLost++;
      else
        matchTie++;
      return null;
    });

    setWin(matchWon);
    setLose(matchLost);
    setTie(matchTie);
    if (matchWon === 0)
      setRatio('0');
    else if (matchLost === 0)
      setRatio('1');
    else {
      const ratio = matchWon / (matchWon + matchLost);
      setRatio(ratio.toFixed(2));
    }

    if (requestedFriends.length === 0)
      setHasFriendRequest(false);
    else
      setHasFriendRequest(true);
  }, [friends, requestedFriends, scores])

  return (
    <div>
      <Header />
      <div className="User">
        <h3>{nick}</h3>
        <div className="avatar">
          <img src={avatar ? URL.createObjectURL(new Blob([Buffer.from(avatar.buffer.data)])) : "./default-avatar.webp"}  alt="Avatar" width="80%"/>
          {/* <br />
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
          /> */}
        </div>
        <div className="stats">
          <p key={"Win"} className="win">{win} Win</p>
          <p key={"Tie"} className="tie">{tie} Tie</p>
          <p key={"Loseeeeee"} className="lose">{lose} Loss</p>
          <p key={"Ratio"} className="ratio">{ratio} Ratio</p>
        </div>
        <div className="requested_friends">
          {hasFriendRequest && <h4>Friends Requests</h4>}
          {requestedFriends.map((friend, i) => {
            return (
              <p className="buttons small_buttons" key={i}>
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
          <ul>
          {friends.map((friend, i) => {
            let status = "offline";
            if (friend.inGame)
              status = "inGame";
            else if (friend.online)
              status = "online";
            return (
              <Link key={i} to={`/other_user/${friend.user42}`}>
                <li className={status}>{friend.nick}</li>
              </Link>
            )
          })}
          </ul>
        </div>
        <div className="match_history">
          <h4>History</h4>
          <ul>
          {scores.map((score, i) => {
            return (
              <li key={i}>{score.playerScore} - {score.enemyScore}</li>
            )
          })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default User;
