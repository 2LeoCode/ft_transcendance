import { Channel } from '../channel/channel.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @ManyToOne(() => User, (usr) => usr.messagesOut)
  sender: User;

	@Column()
	messageType: 'private' | 'channel';

	@ManyToOne(() => Channel, (cha) => cha.messages)
	channelReceiver: Channel;

	@ManyToOne(() => User, (usr) => usr.messagesIn)
	userReceiver: User;
};
