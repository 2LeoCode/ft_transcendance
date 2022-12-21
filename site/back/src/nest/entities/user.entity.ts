import ScoreEntity from './score.entity';
import ReceiverEntity from './receiver.entity';
import MessageEntity from './message.entity';
import ChannelEntity from './channel.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import ImageEntity from './image.entity';

@Entity()
export default class UserEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	nick: string;

	@Column()
	user42: string;

	@Column({ nullable: true, default: null, type: 'json' })
	avatar: ImageEntity;

	@ManyToMany(
		() => UserEntity,
		(user: UserEntity) => user.blocked,
	)
	blockedBy: UserEntity[];

	@ManyToMany(
		() => UserEntity,
		(user: UserEntity) => user.blockedBy,
	)
	@JoinTable()
	blocked: UserEntity[];

	@OneToMany(
		() => ScoreEntity,
		(scr: ScoreEntity) => scr.user,
		{ cascade: true }
	)
	scores: ScoreEntity[];

	@Column({ default: true })
	online: boolean;

	@ManyToMany(() => UserEntity)
	@JoinTable()
	friendRequests: UserEntity[];

	@ManyToMany(() => UserEntity)
	@JoinTable()
	friends: UserEntity[];

	@ManyToMany(
		() => ChannelEntity,
		(channel: ChannelEntity) => channel.invites,
		{ cascade: true }
	)
	channelInvites: ChannelEntity[];

	@OneToMany(
		() => ChannelEntity,
		(cha: ChannelEntity) => cha.owner,
		{ cascade: true }
	)
	ownedChannels: ChannelEntity[];

	@ManyToMany(
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
		(receiver: ReceiverEntity) => receiver.parentUser,
		{ eager: true, onDelete: 'CASCADE', nullable: true }
	)
	@JoinColumn()
	receiver: ReceiverEntity;

	@Column({ nullable: true, default: null })
	twoFactorSecret: string;
}
