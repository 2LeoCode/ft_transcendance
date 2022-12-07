import MessageEntity from './message.entity';
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import UserEntity from './user.entity';
import ChannelEntity from './channel.entity';

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

	@OneToOne(
		() => UserEntity,
		(user: UserEntity) => user.receiver,
		{ nullable: true, onDelete: 'CASCADE' }
	)
	parentUser: UserEntity;

	@OneToOne(
		() => ChannelEntity,
		(channel: ChannelEntity) => channel.receiver,
		{ nullable: true, onDelete: 'CASCADE' }
	)
	parentChannel: ChannelEntity;
}
