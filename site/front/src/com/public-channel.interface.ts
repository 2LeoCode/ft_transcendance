export type ChannelVisibility = 'visible' | 'hidden';
export type ChannelAccessibility = 'public' | 'private';

export default interface PublicChannel {
	id: string;
	name: string;
	password: string;
	accessibility: ChannelAccessibility;
	visibility: ChannelVisibility;
}
