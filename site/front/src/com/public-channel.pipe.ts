import ComPipe from "./pipes/com.pipe";
import PublicChannel from "./interfaces/public-channel.interface";

export default class PublicChannelPipe {
	constructor(
		private readonly comPipe: ComPipe,
		private readonly publicChannel: PublicChannel
	) {}
}