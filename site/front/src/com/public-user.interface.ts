export default interface PublicUser {
	id: string;
	user42: string;
	nick: Promise<string>;
	avatarPath: Promise<string>;
	online: Promise<boolean>;
}
