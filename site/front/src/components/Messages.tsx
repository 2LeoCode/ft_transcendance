import { useState, useEffect } from "react";
import { Message } from "../com/message.com";
import { User, UserCom } from "../com/user.com";
import { user_infos } from "./SignUp";

export default function Messages() {
  let [messages, setMessages] = useState<Message[]>([]);
  let [user, setUser] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      setUser((await UserCom.get({ nick: user_infos.nick }))[0]);
      setMessages(user[0].messagesIn);
    })();
  }, [user, messages]);
  return (
    <>
      {
        messages.map((message: Message) => {
          return (
            <ul className = {
              message.sender.id === user[0].id
              ? "own_message" : "other_message"
            }>
              <div>{message.content}</div>
            </ul>
          )
        })

      }
    </>
  );
}
