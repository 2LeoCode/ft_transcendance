import { useAtom } from "jotai";
import { Fragment, useEffect } from "react";
import ClientSocket from "../com/client-socket";
import EntityParser from "../com/entity-parser";
import useDatabase from "../com/use-database"
import ChatSocket from "./chat/ChatSocket";

const SocketInit = () => {
  const db = useDatabase();
  const [, setOnlineUsers] = useAtom(db.onlineUsersAtom);
	const [, setScores] = useAtom(db.user.scoresAtom);

	useEffect(() => {
		
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