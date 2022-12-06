import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
//import { UserCom } from "../com/user.com";
import Friend from '../components/Friend';
import Header from '../components/Header';
import '../styles/Chat.css';
import { GameState, IRoom, User } from '../gameObjects/GameObject';
import { useResolvedPath } from 'react-router-dom';
import DirectMessage from '../components/DirectMessage';
import Channel from '../components/Channel';
import Members from '../components/Members';
import ClientSocket from '../com/client-socket';
import ChannelsList from '../components/ChannelsList';
import { create } from '@mui/material/styles/createTransitions';

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

async function createChannel(e: any) {}

function Chat() {
  const [id, setId] = useState('');
  const [isChannel, setIsChannel] = useState(false);
  const [isDm, setIsDm] = useState(false);
  const [DmName, setDmName] = useState<string>();
  const [currentUsers, setCurrentUsers] = useState<User[]>([]);
  const [currentChannels, setCurrentChannels] = useState<string[]>([]);
  const [friends_id_tab, setFriends_id_tab] = useState([]);
  const [friends_name_tab, setFriends_name_tab] = useState<any[] | any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [nameChannel, setNameChannel] = useState('');
  const [channelName, setChannelName] = useState('');
  const [emitMessageTo, setEmitMessageTo] = useState('');
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

  let createdChannels: Map<string, IRoom> = new Map();

  // const updateCurrentUsers = (currentGamesUsers: User[]) => {
  //   const users: User[] = [];

  //   for (const user of currentGamesUsers) {
  //     users.push({
  //       socketId: user.socketId,
  //       id: 0,
  //       username: 'default'
  //     });
  //   }
  //   setCurrentUsers(users);
  // };

  const createChannel = (e: any) => {
    e.preventDefault();
    socket.emit('ChannelRoom', nameChannel); // load dm room with e.currentTarget.value and socketProps.socketId
    console.log('Channel created ' + nameChannel);
  };

  const submitMessage = (e: any) => {
    e.preventDefault();
    socket.emit('tmpMessageStock', name);

    if (isChannel === true)
      socket.emit("submitMessageChannel", emitMessageTo);
    else if (isDm === true)
      socket.emit('submitMessage', DmName);
  };

  // socket.on("newRoom", (newRoomData: IRoom) => {
  //   socket.emit("joinRoom", newRoomData.roomId);
  // });

  useEffect((): any => {
    socket = ClientSocket;

    socket.emit('updateChatUser');

    // socket.on('disconnect', (currentGamesUsers: User[]) => {
    //   // updateCurrentUsers(currentGamesUsers);

    // });

    // socket.on('updateCurrentUsers', (currentGamesUsers: User[]) => {
    //   updateCurrentUsers(currentGamesUsers);
    // });

    socket.on('ChannelCreated', (currentChannels: IRoom, channelName: string) => {
      if (currentChannels) {
        console.log("coucou " + currentChannels.roomId);
        setCurrentChannels(current => [...current, channelName]);
        createdChannels.set(channelName, currentChannels);
      } else {
        setCurrentChannels([channelName]);
        createdChannels.set(channelName, currentChannels);
      }
    });

    socket.on('joinedChannelRoom', (roomId: string) => {
      setEmitMessageTo(roomId);
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

    // setMounted(true);
  }, []);

  // if (!mounted) {
  //   initFriends();
  // }
  // useEffect(() => {
  //   setMounted(true);
  // }, []);


  return (
    <div>
      <Header />
      <div className="Chat">
        <div className="left-pannel">
          <h3>Channels</h3>
          <ul className="channels_list">
            {currentChannels.map((channel, index) => {
                return (
                  <ChannelsList
                    key={index}
                    socketProps={socket}
                    name={channel}
                    setter={setIsChannel}
                    setIsDm={setIsDm}
                  />
                );
              })}
          </ul>
          {isChannel && (
            <div>
              <h3>Admins</h3>
              <ul className="admins">
                <li>
                  <div className="status online"></div>
                  <img src="./default-avatar.webp" alt="Avatar" width="20px" />
                  Admin 1
                </li>
              </ul>
            </div>
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
                setIsChannel={setIsChannel}
                setName={setDmName}
              />
            );
            // }
          })}
          <br />
          <div className="create_channel">
            <form onSubmit={createChannel}>
              <input
                type="text"
                placeholder="Channel Name"
                onChange={(e) => {
                  setNameChannel(e.target.value);
                }}
              />
              <button>Create Channel</button>
            </form>
          </div>
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
          {isDm && !isChannel && <DirectMessage socket={socket} name={DmName} />}
          {isChannel && !isDm && <Channel socket={socket} channelName={channelName} />}
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
