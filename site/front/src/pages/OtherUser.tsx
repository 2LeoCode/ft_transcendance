import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/User.css';
import { useAtom } from 'jotai';
import useDatabase from '../com/use-database';
import ClientSocket from '../com/client-socket';
import { Socket } from 'socket.io-client';
import Score from '../com/interfaces/score.interface';

let socket: Socket;

// declare const Blob: {
//   prototype: Blob;
//   new(): Blob;
//   new(request: any, mime: string): Blob;
// };

function OtherUser() {
  const Database = useDatabase();
  const params = useParams();
  const username = params.userName;

  const [matches_won, setMatch_won] = useState(0);
  const [matches_lost, setMatch_lost] = useState(0);
  const [matches_tie, setMatch_tie] = useState(0);
  const [win, setWin] = useState(0);
  const [tie, setTie] = useState(0);
  const [lose, setLose] = useState(0);
  const [ratio, setRatio] = useState('0');
  const [scores, setScores] = useState<Score[]>([]);
  const [friends] = useAtom(Database.user.friendsAtom);
  const [alreadyFriend, setAlreadyFriend] = useState(false);
  const [blocked] = useAtom(Database.user.blockedAtom);
  const [alreadyBlocked, setAlreadyBlocked] = useState(false);

  function inviteFriend(e: React.MouseEvent<HTMLButtonElement>) {
    const friendName = e.currentTarget.value;
    socket.emit('sendfriendRequest', friendName);
  }

  function removeFriend(e: React.MouseEvent<HTMLButtonElement>) {
    const friendName = e.currentTarget.value;
    socket.emit('removeFriend', friendName);
  }

  function blockUser(e: React.MouseEvent<HTMLButtonElement>) {
    const username = e.currentTarget.value;
    socket.emit('blockUser', username);
    if (friends.find((usr) => usr.user42 === username)) removeFriend(e);
    socket.emit('removeFriendRequest', username);
  }

  function unblockUser(e: React.MouseEvent<HTMLButtonElement>) {
    const username = e.currentTarget.value;
    socket.emit('unblockUser', username);
  }

  const updateScores = (score: Score[]) => {
    const scores: Score[] = [];

    for (const sco of score) {
      scores.push({
        id: sco.id,
        playerScore: sco.playerScore,
        enemyScore: sco.enemyScore,
        date: sco.date,
        user: sco.user
      });
    }
    setScores(scores);
  };

  useEffect(() => {
    socket = ClientSocket;

    socket.emit('getOtherUserScores', username);

    socket.on('otherUserScores', (scores: Score[]) => {
      updateScores(scores);

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
    });

    let tmp: boolean = false;
    friends.map((friend) => {
      if (friend.user42 === username) {
        setAlreadyFriend(true);
        tmp = true;
      }
      return null;
    });

    if (tmp === false) {
      setAlreadyFriend(false);
    }

    let tmp2: boolean = false;
    blocked.map((block) => {
      if (block.user42 === username) {
        setAlreadyBlocked(true);
        tmp2 = true;
      }
      return null;
    });

    if (tmp2 === false) {
      setAlreadyBlocked(false);
    }
  }, [friends, blocked, username, matches_won, matches_lost, matches_tie]);

  return (
    <div>
      <Header />
      <div className="User">
        <h3>{username}</h3>
        <div className="avatar">
          <img src="../default-avatar.webp" alt="Avatar" width="80%" />
        </div>
        <div className="stats">
          {!alreadyBlocked && (
            <div>
              <p key={'Winnnn'} className="win">
                {win} Win
              </p>
              <p key={'Tieeee'} className="tie">
                {tie} Tie
              </p>
              <p key={'Lose'} className="lose">
                {lose} Lose
              </p>
              <p key={'Ratio'} className="ratio">
                {ratio} Ratio
              </p>
            </div>
          )}
        </div>
        <div className="match_history">
          {!alreadyBlocked && (
            <div>
              <h4>History</h4>
              {scores.map((score, i) => {
                return (
                  <ul key={i}>
                    {score.playerScore} - {score.enemyScore}
                  </ul>
                );
              })}
            </div>
          )}
        </div>
        <div className="otherUser_buttons">
          {!alreadyFriend && !alreadyBlocked && (
            <button value={username} onClick={inviteFriend}>
              Send friend request
            </button>
          )}
          {!alreadyBlocked && (
            <button value={username} onClick={blockUser}>
              Block user
            </button>
          )}
          {alreadyBlocked && (
            <button value={username} onClick={unblockUser}>
              Unblock user
            </button>
          )}
          {alreadyFriend && (
            <button value={username} onClick={removeFriend}>
              Remove friend
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OtherUser;
