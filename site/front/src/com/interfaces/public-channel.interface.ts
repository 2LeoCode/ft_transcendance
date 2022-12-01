import { Atom } from "jotai";

export type ChannelVisibility = 'visible' | 'hidden';
export type ChannelAccessibility = 'public' | 'private';

export default interface PublicChannel {
	id: string;
	name: Atom<string>;
	password: Atom<string>;
	accessibility: Atom<ChannelAccessibility>;
	visibility: Atom<ChannelVisibility>;
}
