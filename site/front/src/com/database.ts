import { atom } from "jotai";
import Constants from "./constants";
import EntityParser from "./entity-parser";

const DatabaseLoader = (async () => Object.seal({

	user: EntityParser.user(
		await fetch(`${Constants.serverHost}/user/me`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${Constants.jwtToken}`
			}
		}).then(res => {
			if (!res.ok)
				throw new Error(res.statusText);
			return res.json();
		})
	),

	visibleChannels: atom(
		await fetch(`${Constants.serverHost}/channel`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${Constants.jwtToken}`
			}
		}).then(async res => {
			if (!res.ok)
				throw new Error(res.statusText);
			return (await res.json()).map((channel: any) =>
				EntityParser.publicChannel(channel)
			);
		})
	),

	onlineUsers: atom(
		await fetch(`${Constants.serverHost}/user/online`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${Constants.jwtToken}`
			}
		}).then(async res => {
			if (!res.ok)
				throw new Error(res.statusText);
			return (await res.json()).map((user: any) =>
				EntityParser.publicUser(user)
			);
		})
	),

}))();

export let Database: Awaited<typeof DatabaseLoader>;

export type DatabaseType = typeof Database;

export const syncDatabase = async () => {
	Database = await DatabaseLoader;
};
