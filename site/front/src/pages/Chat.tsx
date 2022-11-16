import React, { useEffect, useState } from "react";
import { UserCom } from "../com/user.com";
import Friend from "../components/Friend";
import Header from "../components/Header";
import { user_infos } from "../components/SignUp";
import "../styles/Chat.css";

async function addFriend(e: any, id: string, friends_name_tab: string[]) {
  e.preventDefault();
  let friends_tab: string[] = [];
  await UserCom.get({ nick: user_infos.nick }).then((res) => {
    friends_tab = res[0].friendIds;
  });
  await UserCom.get({ nick: e.target[0].value }).then((res) => {
    // console.log(res);
    friends_tab.push(res[0].id);
    // friends_name_tab.push(res[0].nick);
  });
  await UserCom.update(id, { friendIds: friends_tab });
}

function Chat() {
  const [id, setId] = useState("");
  const [friends_id_tab, setFriends_id_tab] = useState([]);
  const [friends_name_tab, setFriends_name_tab] = useState<any[] | any[]>([]);
  const [mounted, setMounted] = useState(false);
  const initFriends = async () => {
    await UserCom.get({ nick: user_infos.nick }).then((res) => {
      // console.log(res);
      setId(res[0].id);
      setFriends_id_tab(res[0].friendIds);
      for (let i = 0; i < res[0].friendIds.length; i++) {
        UserCom.get({ id: res[0].friendIds[i] }).then((res) => {
          // console.log(res);
          setFriends_name_tab((friends_name_tab) => [
            ...friends_name_tab,
            res[0].nick,
          ]);
        });
      }
    });
  };
  if (!mounted) {
    initFriends();
  }
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
          <h3>Members</h3>
          <ul className="members">
            <li>
              <div className="status online"></div>
              <img src="./default-avatar.webp" alt="Avatar" width="20px" />
              Member 1
            </li>
            <li>
              <div className="status online"></div>
              <img src="./default-avatar.webp" alt="Avatar" width="20px" />
              Member 2
            </li>
            <li>
              <div className="status online"></div>
              <img src="./default-avatar.webp" alt="Avatar" width="20px" />
              Member 3
            </li>
          </ul>
          <h4 className="create_channel">Create Channel</h4>
        </div>
        <ul className="main">
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
              return <Friend key={index} name={x} />;
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
