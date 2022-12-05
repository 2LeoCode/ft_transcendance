import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import UserEntity from './user.entity';
import ReceiverEntity from './receiver.entity';

@Entity()
export default class MessageEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	content: string;

	@CreateDateColumn()
	createDate: Date;

	@UpdateDateColumn()
	updateDate: Date;

	@ManyToOne(
		() => UserEntity,
		(user: UserEntity) => user.messages,
		{
			nullable: false,
			onDelete: 'CASCADE'
		},
	)
	sender: UserEntity;

	@ManyToOne(
		() => ReceiverEntity,
		(receiver: ReceiverEntity) => receiver.messages,
		{
			nullable: false,
			onDelete: 'CASCADE'
		},
	)
	receiver: ReceiverEntity;
}
