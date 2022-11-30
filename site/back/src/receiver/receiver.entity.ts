import MessageEntity from '../message/message.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export type ReceiverType = 'User' | 'Channel';

@Entity()
export default class ReceiverEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	type: ReceiverType;

	@OneToMany(
		() => MessageEntity,
		(msg: MessageEntity) => msg.receiver,
		{ cascade: true }
	)
	messages: MessageEntity[];
}
