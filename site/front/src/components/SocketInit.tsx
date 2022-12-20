import { spawn } from "child_process";
import { useAtom } from "jotai";
import { Fragment, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import swal from "sweetalert";
import ClientSocket from "../com/client-socket";
import EntityParser from "../com/entity-parser";
import useDatabase from "../com/use-database"
import ChatSocket from "./chat/ChatSocket";

const SocketInit = () => {
  const db = useDatabase();
  const [isInRequests, setIsInRequests] = useState("");
  const [, setOnlineUsers] = useAtom(db.onlineUsersAtom);
  const [, setScores] = useAtom(db.user.scoresAtom);
  const [friends, setFriends] = useAtom(db.user.friendsAtom);
  const [friendsRequests, setFriendRequests] = useAtom(db.user.friendRequestsAtom);
  const [blocked, setBlocked] = useAtom(db.user.blockedAtom);




  useEffect(() => {

    ClientSocket.on('friendRequest', async (previous: string, entity: any) => {
      if (isInRequests === previous)
        return;
      else
        setIsInRequests(previous);
      friendsRequests.map((friend) => {
        if (friend.user42 === entity.username)
          return;
      })
      friends.map((friend) => {
        if (friend.user42 === entity.username)
          return;
      })
      const newFriendRequest = EntityParser.publicUser(entity);
      setFriendRequests((current) => [...current, newFriendRequest]);
    })

    ClientSocket.on('swalError', (entity: string) => {
      swal(entity);
    })

    ClientSocket.on('acceptFriendRequest', (previous: string, entity: any) => {
      if (isInRequests === previous)
        return;
      else
        setIsInRequests(previous);
      const newFriend = EntityParser.publicUser(entity);
      setFriends((prev) => [...prev, newFriend]);
    })

    ClientSocket.on('removeFriendUpdate', (entity: any) => {
      setFriends((current) => current.filter((friend) => friend.user42 !== entity));
    })

    ClientSocket.on('removeRequest', (entity: any) => {
      setFriendRequests((current) => current.filter((friend) => friend.user42 !== entity.user42));
    })

    ClientSocket.on('blockUserUpdate', (entity: any) => {
      blocked.map((block) => {
        if (block.user42 === entity.user42)
          return;
      })
      const newBlocked = EntityParser.publicUser(entity);
      setBlocked((prev) => [...prev, newBlocked]);
    })

    ClientSocket.on('unblockUserUpdate', (entity: any) => {
      setBlocked((prev) => prev.filter((block) => block.user42 !== entity.user42));
    })

    setFriendRequests(db.user.friendRequests);

    ClientSocket.on('newScore', (score: any) => {
      const newScore = EntityParser.score(score);
      setScores((prev) => [...prev, newScore]);
    })

  }, [])


  useEffect(() => {
    ClientSocket
      .on('clientDisconnected', (username) => {
        // console.log(`client ${username} disconnected`);
        setOnlineUsers(prev => prev.filter((user) => user.user42 !== username));
      })
      .on('clientConnected', (entity: any) => {
        // console.log(`client ${entity.user42} connected`);
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