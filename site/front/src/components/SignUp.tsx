import React, { useState, useRef } from "react";
import { UserCom } from "../com/user.com";
import "../styles/SignUp.css";
import { NavLink } from "react-router-dom";


export const user_infos =
{
    nick: "bob43",
    mail: "abc@abc.fr",
    firstName: "bob",
    lastName: "abc",
    password: "test1234"
};

function SignUp() {

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const input = useRef(null);

  return (<div className="SignUp">
    <form>
        <label>User Name :</label>
        <input type="text" name="username" id="username"
          value={name} onChange={(e) => setName(e.target.value)}
          ref={input}/>
        <label>Password :</label>
        <input type="password" name="password" id="password"
          value={password} onChange={(e) => setPassword(e.target.value)}/>
        <input type="submit" value="Send" id="submit"
        onClick={() => UserCom.add(user_infos)}/>
        <NavLink to="/pong">
          <input type="button" value="go to site" />
        </NavLink>
    </form>
  </div>);
}

export default SignUp;
