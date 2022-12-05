import { atom, useAtom } from "jotai";
import { Fragment, useEffect, useState } from "react";
import Pong from "../pages/Pong";

export const SyncAtom = atom(false);

const Loader = () => {
  const [sync, setSync] = useAtom(SyncAtom);

  useEffect(() => {
    (async () => {
	  const db = require('../com/database');
      await db.syncDatabase();
      setSync(true);
    })();
  }, []);
  return sync ? <Pong /> : <Fragment>Loading...</Fragment>;
};

export default Loader;
