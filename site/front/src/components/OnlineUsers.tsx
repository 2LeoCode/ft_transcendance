import React from "react";
import { User, UserCom } from "../com/user.com";

export default function OnlineUsers() {
let [users, setUsers] = React.useState<User[]>([]);

  React.useEffect(() => {
    (async () => {
      setUsers(await UserCom.get({active: true}));
    })();
  }, [users]);

  return (
  <>
    <h3>Online Users</h3>
    <ul className="online_users">
      {
        users.map((user: User) => (
          <li>
            <div>{user.nick}</div>
          </li>
        ))
      }
    </ul>
  </>
  );
}
