import ScoreEntity from '../score/score.entity';
import ReceiverEntity from '../receiver/receiver.entity';
import MessageEntity from '../message/message.entity';
import ChannelEntity from '../channel/channel.entity';
import { Column, Entity, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class UserEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	nick: string;

	@Column('text', { nullable: true })
	avatar: Express.Multer.File;

	@OneToMany(
		() => ScoreEntity,
		(scr: ScoreEntity) => scr.user,
		{ cascade: true }
	)
	scores: ScoreEntity[];

	@Column({ default: true })
	online: boolean;

	@ManyToMany(
		() => UserEntity,
		{ cascade: true }
	)
	friendRequests: UserEntity[];

	@ManyToMany(
		() => UserEntity,
		{ cascade: true }
	)
	friends: UserEntity[];

	@OneToMany(
		() => ChannelEntity,
		(cha: ChannelEntity) => cha.owner,
		{ cascade: true }
	)
	ownedChannels: ChannelEntity[];

	@OneToMany(
		() => ChannelEntity,
		(cha: ChannelEntity) => cha.users,
		{ cascade: true }
	)
	channels: ChannelEntity[];

	@OneToMany(
		() => MessageEntity,
		(msg: MessageEntity) => msg.sender,
		{ cascade: true }
	)
	messages: MessageEntity[];
	
	@OneToOne(
		() => ReceiverEntity,
		{ cascade: true }
	)
	receiver: ReceiverEntity;
}
