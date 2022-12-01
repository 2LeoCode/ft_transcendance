import { Atom } from "jotai";

export default interface PublicUser {
	id: string;
	user42: string;
	nick: Atom<string>;
	avatarPath: Atom<string>;
	online: Atom<boolean>;
}
