import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import "../styles/User.css";
import { atom, useAtom } from "jotai";
import { Database } from "../com/database";
import useDatabase from "../com/use-database";
import ClientSocket from "../com/client-socket";
import { Socket } from "socket.io-client";
import Score from "../com/interfaces/score.interface";

let socket: Socket;

declare const Blob: {
  prototype: Blob;
  new(): Blob;
  new(request: any, mime: string): Blob;
};

function OtherUser() {

  const Database = useDatabase();
  const params = useParams();
  const username = params.userName;

  let matches_won: number;
  let matches_lost: number;
  let matches_tie: number;
  const [win, setWin] = useState(0);
  const [tie, setTie] = useState(0);
  const [lose, setLose] = useState(0);
  const [scores, setScores] = useState<Score[]>([]);
  const [uploaded, setUploaded] = useState(false);
  const [friends] = useAtom(Database.user.friendsAtom);
  const [requestedFriends] = useAtom(Database.user.friendRequestsAtom);
  const [alreadyFriend, setAlreadyFriend] = useState(false);
  const [blocked, setBlocked] = useAtom(Database.user.blockedAtom);
  const [alreadyBlocked, setAlreadyBlocked] = useState(false);

  function inviteFriend(e: React.MouseEvent<HTMLButtonElement>) {
    const friendName = e.currentTarget.value;
    console.log(friendName);
    socket.emit("sendfriendRequest", friendName);
  }

  function removeFriend(e: React.MouseEvent<HTMLButtonElement>) {
    const friendName = e.currentTarget.value;
    console.log(friendName);
    socket.emit("removeFriend", friendName);
  }

  function blockUser(e: React.MouseEvent<HTMLButtonElement>) {
    const friendName = e.currentTarget.value;
    console.log(friendName);
    socket.emit("blockUser", friendName);
    removeFriend(e);
  }

  function unblockUser(e: React.MouseEvent<HTMLButtonElement>) {
    const friendName = e.currentTarget.value;
    console.log(friendName);
    socket.emit("unblockUser", friendName);
  }

  const updateScores = (score: Score[]) => {
    const scores: Score[] = [];

    for (const sco of score) {
      scores.push({
        id: sco.id,
        playerScore: sco.playerScore,
        enemyScore: sco.enemyScore,
        date: sco.date,
        user: sco.user,
      });
    }
    setScores(scores);
  };

  useEffect(() => {

    socket = ClientSocket;

    socket.emit("getOtherUserScores", username);

    socket.on("otherUserScores", (scores: Score[]) => {
      updateScores(scores);

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
    });

    let tmp: boolean = false;

    console.log("tmp = " + tmp);
    console.log(friends);
    friends.map((friend) => {
      if (friend.user42 === username) {
        setAlreadyFriend(true);
        tmp = true;
      }
    });

    console.log("tmp = " + tmp);

    if (tmp === false) {
      setAlreadyFriend(false);
    }

    let tmp2: boolean = false;
    blocked.map((block) => {
      if (block.user42 === username) {
        setAlreadyBlocked(true);
        tmp2 = true;
      }
    });

    if (tmp2 === false) {
      setAlreadyBlocked(false);
    }

  }, [friends, blocked]);

  return (
    <div>
      <Header />
      <div className="User">
        <h3>{username}</h3>
        <div className="avatar">
          <img src="../default-avatar.webp" alt="Avatar" width="80%" />
        </div>
        <div className="stats">
          {!alreadyBlocked &&
            <div>
              <p key={"Winnnn"} className="win">{win} Win</p>
              <p key={"Tieeee"} className="tie">{tie} Tie</p>
              <p key={"Lose"} className="lose">{lose} Lose</p>
            </div>}
        </div>
        <div className="match_history">
          {!alreadyBlocked &&
            <div>
              <h4>History</h4>
              {scores.map((score, i) => {
                return (
                  <ul key={i}>{score.playerScore} - {score.enemyScore}</ul>
                )
              })}
            </div>}
        </div>
        <div className="otherUser_buttons">
          {!alreadyFriend &&
            <button
              value={username}
              onClick={inviteFriend}
            >
              Send friend request
            </button>}
          {!alreadyBlocked &&
            <button
              value={username}
              onClick={blockUser}
            >
              Block user
            </button>}
          {alreadyBlocked &&
            <button
              value={username}
              onClick={unblockUser}
            >
              Unblock user
            </button>}
          {alreadyFriend &&
            <button
              value={username}
              onClick={removeFriend}
            >
              Remove friend
            </button>}
        </div>
      </div>
    </div>
  );
}

export default OtherUser;
