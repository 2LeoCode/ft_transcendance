import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserCom } from "../com/user.com";
import "../styles/SignUp.css";

export let user_infos = {
  nick: "bobabc",
  mail: "abc@abc.fr",
  firstName: "bob",
  lastName: "abc",
  password: "test1234",
};

function SignUp() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    user_infos.nick = name;
    user_infos.password = password;
    UserCom.add(user_infos);
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
