import { useAtom } from "jotai";
import { useEffect } from "react";
import { LoggedAtom, StatusAtom } from "../App";
import ClientSocket from "../com/client-socket";
import EntityParser from "../com/entity-parser";
import useDatabase from "../com/use-database"

const SocketInit = () => {
  const db = useDatabase();
  const [, setOnlineUsers] = useAtom(db.onlineUsersAtom);

  useEffect(() => {
    console.log('SocketInit');
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

  return null;
}

export default SocketInit;