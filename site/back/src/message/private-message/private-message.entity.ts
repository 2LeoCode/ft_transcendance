import { ChildEntity, ManyToOne } from 'typeorm';
import { Message } from '../message.entity';
import { User } from '../../user/user.entity';

@ChildEntity()
export class PrivateMessage extends Message {
	@ManyToOne(() => User, (usr) => usr.messages)
	receiver: User;
};
