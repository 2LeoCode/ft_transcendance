import { atom, useAtom } from "jotai";
import { Fragment, useEffect, useState } from "react";
import useDatabase from "../com/use-database";
import Pong from "../pages/Pong";

export const SyncAtom = atom(false);

const Loader = () => {
  const [sync, setSync] = useAtom(SyncAtom);
  const db2 = useDatabase();

  useEffect(() => {
	//console.log('in loader');
    (async () => {
	  const db = require('../com/database');
      await db.syncDatabase();
      
      setSync(true);
    })();
  }, []);
  return sync ? <Pong /> : <Fragment>Loading...</Fragment>;
};

export default Loader;
