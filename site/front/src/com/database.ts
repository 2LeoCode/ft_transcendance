import { atom } from "jotai";
import Constants from "./constants";
import EntityParser from "./entity-parser";
import PublicChannel from "./interfaces/public-channel.interface";
import PublicUser from "./interfaces/public-user.interface";

const DatabaseLoader = (async () => {
	const DatabaseLoaderNoAtom = {
		visibleChannels: await fetch(`${Constants.serverHost}/channel`, {
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
		}) as PublicChannel[],

		onlineUsers: await fetch(`${Constants.serverHost}/user/online`, {
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
		}) as PublicUser[],

		user: EntityParser.user(
			await fetch(`${Constants.serverHost}/user/me`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${Constants.jwtToken}`
				}
			}).then(async res => {
				if (!res.ok)
					throw new Error(res.statusText);
				return res.json();
			})
		)
	}

	return Object.seal({
		...DatabaseLoaderNoAtom,
		visibleChannelsAtom: atom(DatabaseLoaderNoAtom.visibleChannels),
		onlineUsersAtom: atom(DatabaseLoaderNoAtom.onlineUsers),
	})
})();

export let Database: Awaited<typeof DatabaseLoader>;

export type DatabaseType = typeof Database;

export const syncDatabase = async () => {
	Database = await DatabaseLoader;
};
