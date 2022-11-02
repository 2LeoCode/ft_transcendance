import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Message } from 'src/message/message.entity';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ default: false })
  isPrivate: boolean;

  @ManyToOne(() => User, (usr) => usr.ownedChannels)
  owner: User;

  @ManyToMany(() => User, (usr) => usr.channels)
  @JoinTable()
  users: User[];

  @OneToMany(() => Message, (msg) => msg.channelReceiver)
  messages: Message[];
}
