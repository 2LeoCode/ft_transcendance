import ComPipe from "./com.pipe";
import PublicUser from "./public-user.interface";

export default class PublicUserPipe {
	constructor(
		private readonly comPipe: ComPipe,
		private readonly publicUser: PublicUser
	) {}
}
