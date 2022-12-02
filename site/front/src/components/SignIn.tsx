import React, { useState, useEffect } from "react";
import "../styles/SignIn.css";
import { useNavigate } from "react-router-dom";
//import { UserCom } from "../com/user.com";
import { user_infos } from "../components/SignUp";
import bcrypt from "bcryptjs";

async function log(password: string) {
  const id = "";
  const pass = "";
  let goodpassword = false;
  //await UserCom.get({ nick: user_infos.nick }).then((res) => {
  //  console.log(res);
  //  id = res[0].id;
  //  pass = res[0].password;
  //});
  const len = id.length;
  if (len > 1) {
    await bcrypt.compare(password, pass).then((res) => {
      goodpassword = res;
    });
    if (goodpassword === false) {
      console.log("Bad password");
      return 2;
    } else {
      //await UserCom.update(id, { online: true }).then((res) => {
      //  console.log(res);
      //});
      return 0;
    }
  } else {
    console.log("Account doesn't exist");
    return 1;
  }
}

function SignIn() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  let pass: number;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    sessionStorage.setItem("username", name);
    sessionStorage.setItem("password", password);
    user_infos.nick = JSON.stringify(sessionStorage.getItem("username")).replace(
      /^"(.*)"$/,
      "$1"
    );
    user_infos.password = JSON.stringify(
      sessionStorage.getItem("password")
    ).replace(/^"(.*)"$/, "$1");
    await log(password).then((res) => {
      pass = res;
    });
    if (pass === 0) navigate("/pong");
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
