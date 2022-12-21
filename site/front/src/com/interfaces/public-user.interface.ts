import { Atom } from '../types/atom.type';
import Image from './image.interface';

export default interface PublicUser {
	id: string;
	user42: string;
	nick: string;
	online: boolean;
	avatar: Image;
	inGame: boolean;

	nickAtom: Atom<string>;
	avatarAtom: Atom<Image>;
	onlineAtom: Atom<boolean>;
	inGameAtom: Atom<boolean>;
}
