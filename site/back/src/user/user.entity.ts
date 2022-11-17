import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import Receiver from 'src/receiver/receiver.entity';
import Channel from '../channel/channel.entity';
import Message from '../message/message.entity';
import Score from '../score/score.entity';

@Entity()
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nick: string;

  @Column('text', { nullable: true })
  avatar: Express.Multer.File;

  @OneToMany(() => Score, scr => scr.user, { cascade: true })
  scores: Score[];

  @Column({ default: true })
  online: boolean;

  @Column('json', { default: [] })
  friendIds: string[];

  @OneToMany(() => Channel, cha => cha.owner, { cascade: true })
  ownedChannels: Channel[];

  @OneToMany(() => Message, msg => msg.sender, { cascade: true })
  messages: Message[];

  @ManyToMany(() => Channel, cha => cha.users)
  channels: Channel[];

  @OneToOne(() => Receiver, { cascade: true })
  @JoinColumn()
  receiver: Receiver;
}
