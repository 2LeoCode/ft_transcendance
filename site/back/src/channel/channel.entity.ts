import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import User from '../user/user.entity';
import Receiver from 'src/receiver/receiver.entity';

@Entity()
export default class Channel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ default: false })
  isPrivate: boolean;

  @ManyToOne(() => User, (usr) => usr.ownedChannels, { nullable: false, onDelete: 'CASCADE' })
  owner: User;

  @ManyToMany(() => User, (usr) => usr.channels)
  @JoinTable()
  users: User[];

  @OneToOne(() => Receiver, { cascade: true })
  @JoinColumn()
  receiver: Receiver;
}
