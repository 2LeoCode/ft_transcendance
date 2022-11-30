import Message from "./message.interface";

export default interface Receiver {
	id: string;
	messages: Message[];
}
