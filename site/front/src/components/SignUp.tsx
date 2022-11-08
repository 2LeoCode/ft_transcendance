import React from "react";
// import "../styles/SignUp.css";



function SignUp() {

    const user_infos =
    {
        nick: "bob",
        mail: "abc@abc.fr",
        firstName: "bob",
        lastName: "abc",
        password: "test1234"
    };


  return (<div className="SignUp">
    <form method="POST" action="http://localhost:2000/user">
        <label>User Name :</label>
        <input type="text" name="username" id="username"/>
        <label>Password :</label>
        <input type="password" name="password" id="password"/>
        <input type="submit" value="Send" id="submit"/>
    </form>
  </div>);
}

export default SignUp;
