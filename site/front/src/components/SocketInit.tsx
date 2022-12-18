import { useAtom } from "jotai";
import { Fragment, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import ClientSocket from "../com/client-socket";
import EntityParser from "../com/entity-parser";
import useDatabase from "../com/use-database"
import ChatSocket from "./chat/ChatSocket";

const SocketInit = () => {
  const db = useDatabase();
  const [isInRequests, setIsInRequests] = useState("");
  const [, setOnlineUsers] = useAtom(db.onlineUsersAtom);
  const [, setScores] = useAtom(db.user.scoresAtom);
  const [, setFriends] = useAtom(db.user.friendsAtom);
  const [friendsRequests, setFriendRequests] = useAtom(db.user.friendRequestsAtom);




  useEffect(() => {

    ClientSocket.on('friendRequest', async (previous: string, entity: any) => {
      if (isInRequests === previous)
        return;
      else
        setIsInRequests(previous);
      console.log(entity);
      const newFriendRequest = EntityParser.publicUser(entity);
      setFriendRequests((current) => [...current, newFriendRequest]);
    })

    ClientSocket.on('acceptFriendRequest', (previous: string, entity: any) => {
      if (isInRequests === previous)
        return;
      else
        setIsInRequests(previous);
      console.log('acceptFriendRequest');
      const newFriend = EntityParser.publicUser(entity);
      console.log(entity);
      setFriends((prev) => [...prev, newFriend]);
    })

    ClientSocket.on('removeRequest', (entity: any) => {
      console.log('removeRequest');
      console.log(entity.user42);
      setFriendRequests((current) => current.filter((friend) => friend.user42 !== entity.user42));
    })

    setFriendRequests(db.user.friendRequests);

    ClientSocket.on('newScore', (score: any) => {
      const newScore = EntityParser.score(score);
      setScores((prev) => [...prev, newScore]);
    })

  }, [])


  useEffect(() => {
    //console.log('SocketInit');
    ClientSocket
      .on('clientDisconnected', (username) => {
        console.log(`client ${username} disconnected`);
        setOnlineUsers(prev => prev.filter((user) => user.user42 !== username));
        // roomId = undefined;
        // setPlay(false);
        // setRoom(null);
      })
      .on('clientConnected', (entity: any) => {
        console.log(`client ${entity.user42} connected`);
        setOnlineUsers(prev => [...prev, EntityParser.publicUser(entity)]);
      })

  }, []);

  return (
    <Fragment>
      <ChatSocket />
    </Fragment>
  );
}

export default SocketInit;