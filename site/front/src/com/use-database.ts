import Database from "./interfaces/database.interface";

const useDatabase = () => {
	return require('./database').Database as Database;
}

export default useDatabase;
