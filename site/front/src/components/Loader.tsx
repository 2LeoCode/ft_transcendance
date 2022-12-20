import { atom, useAtom } from "jotai";
import { CSSProperties, Fragment, useEffect, useState } from "react";
import useDatabase from "../com/use-database";
import Pong from "../pages/Pong";
import '../styles/App.css';
import { ClipLoader } from "react-spinners";

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

  return <ClipLoader
		color="red"
		size='125px'
		className="LoadingSpinner"
	/>;
};

export default Loader;
