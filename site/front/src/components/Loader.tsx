import { Fragment, useEffect, useState } from "react";
import Pong from "../pages/Pong";

const Loader = () => {
	const [sync, setSync] = useState(false);

	useEffect(() => {
		(async () => {
			await require('../com/database').syncServerData();
			setSync(true);
		})();
	}, []);
	return sync ? <Pong /> : <Fragment>Loading...</Fragment>;
};

export default Loader;
