import React, { useState } from "react";
import Log from "./log.component";
import { cookies } from "./log.component";

const Home = () => {
  const [dataList] = useState(
    Object.entries(require("../server-data").ServerData).map(([key, value]) => (
      <li key={key}>{value}</li>
    ))
  );
  const [logOut, setLogOut] = useState(false);

  return logOut ? (
    <Log />
  ) : (
    <React.Fragment>
      <ul id="server-data">{dataList}</ul>
      <button
        id="log-out"
        onClick={() => {
          setLogOut(true);
          cookies.set("logged", "false");
        }}
      >
        Log out
      </button>
    </React.Fragment>
  );
};

export default Home;
