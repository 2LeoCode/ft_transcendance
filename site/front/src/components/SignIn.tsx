import React, { useState, useEffect } from "react";
import "../styles/SignIn.css";
import { useNavigate } from "react-router-dom";
import { UserCom } from "../com/user.com";
import { user_infos } from "../components/SignUp";

async function log() {
  let id: string = "";
  await UserCom.get({ nick: user_infos.nick }).then((res) => {
    console.log(res);
    id = res[0].id;
  });
const len = id.length;
  if (len > 1) {
    await UserCom.update(id, { active: true }).then((res) => {
      console.log(res);
    });
	return 0;
  } else {
    console.log("Account doesn't exist");
	return 1;
  }
}

function SignIn() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  let pass;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    localStorage.setItem("username", name);
    localStorage.setItem("password", password);
    user_infos.nick = JSON.stringify(localStorage.getItem("username")).replace(
      /^"(.*)"$/,
      "$1"
    );
    user_infos.password = JSON.stringify(
      localStorage.getItem("password")
    ).replace(/^"(.*)"$/, "$1");
    await log().then((res) => {
		pass = res;})
	if (pass = 0)
    	navigate("/pong");
  };
  return (
    <div className="SignIn">
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

export default SignIn;
