import ComPipe from "./pipes/com.pipe";
import PublicUser from "./public-user.interface";

export default class PublicUserPipe {
	constructor(
		private readonly publicUser: PublicUser
	) {}
}
