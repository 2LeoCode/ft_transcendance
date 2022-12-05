import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
//import { UserCom } from "../com/user.com";
import Friend from '../components/Friend';
import Header from '../components/Header';
import { user_infos } from '../components/SignUp';
import '../styles/Chat.css';
import { GameState, IRoom, User } from '../gameObjects/GameObject';
import { useResolvedPath } from 'react-router-dom';
import DirectMessage from '../components/DirectMessage';
import Channel from '../components/Channel';
import Members from '../components/Members';
import { updateCommaList } from 'typescript';

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
  const [id, setId] = useState('');
  const [isChannel, setIsChannel] = useState(false);
  const [isDm, setIsDm] = useState(false);
  const [DmName, setDmName] = useState<string>();
  const [currentUsers, setCurrentUsers] = useState<User[]>([]);
  const [createdChannels, setCreatedChannels] = useState<string[]>(['general', 'pong']);
  const [friends_id_tab, setFriends_id_tab] = useState([]);
  const [friends_name_tab, setFriends_name_tab] = useState<any[] | any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const initFriends = async () => {
    //await UserCom.get({ nick: user_infos.nick }).then((res) => {
    //  setId(res[0].id);
    //  setFriends_id_tab(res[0].friendIds);
    //  for (let i = 0; i < res[0].friendIds.length; i++) {
    //    UserCom.get({ id: res[0].friendIds[i] }).then((res) => {
    //      setFriends_name_tab((friends_name_tab) => [
    //        ...friends_name_tab,
    //        res[0].nick,
    //      ]);Message 1
    //    });
    //  }
    //});
  };

  const updateCurrentUsers = (currentGamesUsers: User[]) => {
    const users: User[] = [];

    for (const user of currentGamesUsers) {
      users.push({
        socketId: user.socketId,
        id: 0,
        username: 'default'
      });
    }
    setCurrentUsers(users);
  };

  const goChannel = (e: React.MouseEvent<HTMLButtonElement>) => {
    socket.emit('ChannelRoom', e.currentTarget.value); // load dm room with e.currentTarget.value and socketProps.socketId
    console.log('goDm to ' + e.currentTarget.value);
    setIsDm(false);
    setIsChannel(true);
  };

  const createChannel = (e: React.MouseEvent<HTMLButtonElement>) => {
    socket.emit('CreateChannel', e.currentTarget.value); // load dm room with e.currentTarget.value and socketProps.socketId
    console.log('goDm to ' + e.currentTarget.value);
  };

  const submitMessage = (e: any) => {
    e.preventDefault();
    console.log("name " + name);
    socket.emit("tmpMessageStock", name);
    socket.emit("submitMessage", DmName);
  };
  
  // socket.on("newRoom", (newRoomData: IRoom) => {
  //   socket.emit("joinRoom", newRoomData.roomId);
  // });

  useEffect((): any => {
    socket = io('http://localhost:2000');

    // when a client arrives on page localhost:3000/chat
    socket.on('connect', () => {
      console.log('connect in front ' + socket.id);
      socket.emit('updateChatUser');
    });

    // socket.on('disconnect', (currentGamesUsers: User[]) => {
    //   // updateCurrentUsers(currentGamesUsers);
      
    // });

    socket.on('updateCurrentUsers', (currentGamesUsers: User[]) => {
      updateCurrentUsers(currentGamesUsers);
    });

    socket.on('getUserId', (clientId: string) => {
      // user.push(socketId = clientId);
      // if (clientId !== previousId) {
      //   if (friends_id_tab[0] === "nobody") {
      //     setFriends_id_tab([clientId]);
      //     console.log("this is " + friends_id_tab);
      //   }
      //   else {
      //     setFriends_id_tab(current => [...current, clientId]);
      //     console.log("this is " + friends_id_tab);
      //   }
      //     setPreviousId(clientId);
      // }
    });

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
            {createdChannels.map((channel) => {
              return (
                <button key={channel} value={channel} onClick={goChannel}>
                  {channel}
                </button>
              );
            })}
            {/* <li>Channel 1</li>
            <li>Channel 2</li>
            <li>Channel 3</li> */}
          </ul>
          {isChannel && <h3>Admins</h3>}
          {isChannel && (
            <ul className="admins">
              <li>
                <div className="status online"></div>
                <img src="./default-avatar.webp" alt="Avatar" width="20px" />
                Admin 1
              </li>
            </ul>
          )}
          <h3>Members</h3>
          {currentUsers.map((user, index) => {
            // if (socket && socket.id === user.socketId) {
            //   return (
            //     // <button key={user.socketId} value={user.socketId}>
            //     //   You: <Members socket={user.socketId} name="toto" />
            //     // </button>
            //   );
            // } else {
            return (
              <Members
                key={index}
                socketId={user.socketId}
                socketProps={socket}
                name={`toto${index}`}
                setter={setIsDm}
                setName={setDmName}
              />
            );
            // }
          })}
          <h4>Create Channel</h4>
          <button className="create_channel" onClick={createChannel}>
            Create Channel
          </button>
        </div>
        <ul className="main">
          {!isDm && !isChannel && (
            <div>
              <div className="header">
                <h2>name of chat</h2>
              </div>
              <li className="own_message">Message 1</li>
              <li className="other_message">Message 2</li>
              <li className="own_message">Message 3</li>
              <li className="other_message">Message plus long 4</li>
              <li className="other_message">
                Message beeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeaucoup plus
                long 5
              </li>
            </div>
          )}
          {isDm && <DirectMessage socket={socket} name={DmName} />}
          {isChannel && !isDm && <Channel socket={socket} />}
        </ul>
        <div className="write_msg">
          <form onSubmit={submitMessage}>
            <input
              type="text"
              placeholder="Message..."
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
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
