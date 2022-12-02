import React, { useState } from "react";
import Loader from "./loader.component";
import Cookies from "universal-cookie";

export const cookies = new Cookies();

const Log = () => {
  const [clicked, setClicked] = useState(false);

  return cookies.get("logged") === "true" || clicked ? (
    <Loader />
  ) : (
    <button
      id="my-button"
      onClick={() => {
        setClicked(true);
        cookies.set("logged", "true");
      }}
    >
      Login
    </button>
  );
};

export default Log;
