import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
import { Channel } from '../channel/channel.entity';
import { Message } from '../message/message.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nick: string;

	@Column()
	mail: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column({default: 0})
  highestScore: number;

  @Column("int", {array: true, default: []})
  scoreHistory: number[];

  @Column({default: true})
  active: boolean;

  @Column("json", {array: true, default: []})
  friends: User[];

  @OneToMany(() => Channel, (cha) => cha.owner)
  ownedChannels: Channel[];

	@OneToMany(() => Message, (msg) => msg.userReceiver)
	messagesIn: Message[];

  @OneToMany(() => Message, (msg) => msg.sender)
  messagesOut: Message[];

  @ManyToMany(() => Channel, (cha) => cha.users)
  channels: Channel[];
};
