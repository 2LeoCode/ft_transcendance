import { Atom } from '../types/atom.type';

export default interface PublicUser {
	id: string;
	user42: string;
	nick: string;
	avatarPath: string;
	online: boolean;

	nickAtom: Atom<string>;
	avatarPathAtom: Atom<string>;
	onlineAtom: Atom<boolean>;
}
