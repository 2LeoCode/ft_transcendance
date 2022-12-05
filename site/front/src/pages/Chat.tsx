import React, { useEffect, useState } from "react";
import { io, Socket } from 'socket.io-client';
//import { UserCom } from "../com/user.com";
import Friend from "../components/Friend";
import Header from "../components/Header";
import { user_infos } from "../components/SignUp";
import "../styles/Chat.css";
import { GameState, IRoom, User } from "../gameObjects/GameObject";
import Members from "../components/Members";
import { useResolvedPath } from "react-router-dom";

let socket: Socket;

async function addFriend(e: any, id: string, friends_name_tab: string[]) {
  e.preventDefault();
  const friends_tab: string[] = [];
  //await UserCom.get({ nick: user_infos.nick }).then((res) => {
  //  friends_tab = res[0].friendIds;
  //});
  //await UserCom.get({ nick: e.target[0].value }).then((res) => {
  //  // console.log(res);
  //  friends_tab.push(res[0].id);
  //  // friends_name_tab.push(res[0].nick);
  //}).catch(() => {console.log("user doesn't exist")});
  //await UserCom.update(id, { friendIds: friends_tab });
  window.location.reload();
}

function Chat() {
  const tmpUser: User = {
    socketId: "nobody",
    id: 0,
    username: "default",
  };
  const [id, setId] = useState("");
  const [previousId, setPreviousId] = useState<string>();
  const [currentUsers, setCurrentUsers] = useState<User[]>([tmpUser]);
  const [friends_id_tab, setFriends_id_tab] = useState(["nobody"]);
  const [friends_name_tab, setFriends_name_tab] = useState<any[] | any[]>([]);
  const [mounted, setMounted] = useState(false);
  const initFriends = async () => {
    //await UserCom.get({ nick: user_infos.nick }).then((res) => {
    //  setId(res[0].id);
    //  setFriends_id_tab(res[0].friendIds);
    //  for (let i = 0; i < res[0].friendIds.length; i++) {
    //    UserCom.get({ id: res[0].friendIds[i] }).then((res) => {
    //      setFriends_name_tab((friends_name_tab) => [
    //        ...friends_name_tab,
    //        res[0].nick,
    //      ]);
    //    });
    //  }
    //});
  };

  let user: User[];
  // user[0].socketId = "0";
  
  const updateCurrentUsers = (currentGamesUsers: User[]) => {
		const users: User[] = [];

		for (const user of currentGamesUsers) {
      console.log("push user");
			users.push({
				socketId: user.socketId,
				id: 0,
				username: "default",
			});
		}
		setCurrentUsers(users);
	};
  
  useEffect((): any => {

    socket = io("http://localhost:2000");

    // when a client arrives on page localhost:3000/chat
    socket.on("connect", () => {
      console.log("connect in front");
      socket.emit("updateChatUser");
    });

    socket.on("updateCurrentUsers", (currentGamesUsers: User[]) => {
			updateCurrentUsers(currentGamesUsers);
		}); 

    socket.on('getUserId', (clientId: string)=> {
      // user.push(socketId = clientId);
      if (clientId !== previousId) {
        if (friends_id_tab[0] === "nobody") {
          setFriends_id_tab([clientId]);
          console.log("this is " + friends_id_tab);
        }
        else {
          setFriends_id_tab(current => [...current, clientId]);
          console.log("this is " + friends_id_tab);
        }
          setPreviousId(clientId);
      }
    })

    setMounted(true);
  }, []);

	

  // if (!mounted) {
  //   initFriends();
  // }

  useEffect(() => {
    setMounted(true);
  }, []);


  return (
    <div>
      <Header />
      <div className="Chat">
        <div className="left-pannel">
          <h3>Channels</h3>
          <ul className="channels_list">
            <li>Channel 1</li>
            <li>Channel 2</li>
            <li>Channel 3</li>
          </ul>
          <h3>Admins</h3>
          <ul className="admins">
            <li>
              <div className="status online"></div>
              <img src="./default-avatar.webp" alt="Avatar" width="20px" />
              Admin 1
            </li>
          </ul>
          {<Members currentUsers={currentUsers} socketProps={socket}/>}
          <h4 className="create_channel">Create Channel</h4>
        </div>
        <ul className="main">
          <div className="header"><h2>name of chat</h2></div>
          <li className="own_message">Message 1</li>
          <li className="other_message">Message 2</li>
          <li className="own_message">Message 3</li>
          <li className="other_message">Message plus long 4</li>
          <li className="other_message">
            Message
            beeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeaucoup
            plus long 5
          </li>
        </ul>
        <div className="write_msg">
          <form action="">
            <input type="text" placeholder="Message..." />
            <button type="submit">Send</button>
          </form>
        </div>
        <div className="right-pannel">
          <h3>Friends</h3>
          <ul className="friends">
            {friends_name_tab.map((x, index) => {
              return <Friend key={index} index={index} name={x} />;
            })}
          </ul>
          <form onSubmit={(e) => addFriend(e, id, friends_id_tab)}>
            <input type="text" />
            <input type="submit" value="Add Friend" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
