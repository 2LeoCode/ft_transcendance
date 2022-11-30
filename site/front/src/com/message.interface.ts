import Receiver from './receiver.interface';
import User from './public-user.interface';

export default interface Message {
	id: string;
	sender: User;
	receiver: Receiver;
	createDate: Date;
	updateDate: Date;
	content: string;
}
