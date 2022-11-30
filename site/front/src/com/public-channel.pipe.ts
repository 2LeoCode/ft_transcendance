import ComPipe from "./com.pipe";
import PublicChannel from "./public-channel.interface";

export default class PublicChannelPipe {
	constructor(
		private readonly comPipe: ComPipe,
		private readonly publicChannel: PublicChannel
	) {}
}