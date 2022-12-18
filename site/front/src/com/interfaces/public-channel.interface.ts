import { Atom } from '../types/atom.type';

export type ChannelVisibility = 'visible' | 'hidden';
export type ChannelAccessibility = 'public' | 'private';

export default interface PublicChannel {
	id: string;
	name: string;
	accessibility: ChannelAccessibility;
	visibility: ChannelVisibility;

	nameAtom: Atom<string>;
	accessibilityAtom: Atom<ChannelAccessibility>;
	visibilityAtom: Atom<ChannelVisibility>;
}
