import React, { useEffect, useState } from "react";
import Home from "./home.component";

const Loader = () => {
  const [sync, setSync] = useState(false);

  useEffect(() => {
    (async () => {
      await require("../server-data").syncServerData();
      setSync(true);
    })();
  }, []);
  return sync ? <Home /> : <React.Fragment>Loading...</React.Fragment>;
};

export default Loader;
