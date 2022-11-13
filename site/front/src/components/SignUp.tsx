import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserCom } from "../com/user.com";
import "../styles/SignUp.css";

export let user_infos = {
  id: "a2c6e86a-182a-48a3-8907-428c264d0943",
  nick: JSON.stringify(localStorage.getItem("username")).replace(/^"(.*)"$/, '$1'),
  mail: "abc@abc.fr",
  firstName: "bob",
  lastName: "abc",
  password: JSON.stringify(localStorage.getItem("password")).replace(/^"(.*)"$/, '$1'),
};

function SignUp() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  let exist = false;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await UserCom.get({ nick: name }).then((res) => {
      console.log(res);
      if (res.length > 0)
        exist = true;
    });
    if (exist === true)
      return console.log("Username already taken");
    localStorage.setItem("username", name);
    localStorage.setItem("password", password);
    user_infos.nick = JSON.stringify(localStorage.getItem("username")).replace(/^"(.*)"$/, '$1');
    user_infos.password = JSON.stringify(localStorage.getItem("password")).replace(/^"(.*)"$/, '$1');
    await UserCom.add(user_infos);
    navigate("/pong");
  };

  return (
    <div className="SignUp">
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username :</label>
        <input
          type="text"
          name="username"
          id="username"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <label htmlFor="password">Password :</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input type="submit" value="Send" id="submit" />
      </form>
    </div>
  );
}

export default SignUp;
