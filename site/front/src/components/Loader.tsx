import { atom, useAtom } from "jotai";
import { Fragment, useEffect, useState } from "react";
import useDatabase from "../com/use-database";
import Pong from "../pages/Pong";
export const SyncAtom = atom(false);

const Loader = () => {
  const [, setSync] = useAtom(SyncAtom);

  useEffect(() => {
    (async () => {
      const db = require('../com/database');
      await db.syncDatabase();
      setSync(true);
    })();
  }, []);

  return <Fragment>Loading...</Fragment>;
};

export default Loader;
