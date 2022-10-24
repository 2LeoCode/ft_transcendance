import { ChildEntity, ManyToOne } from 'typeorm';
import { Message } from '../message.entity';
import { Channel } from '../../channel/channel.entity';

@ChildEntity()
export class ChannelMessage extends Message {
	@ManyToOne(() => Channel, (cha) => cha.messages)
	receiver: Channel;
};
