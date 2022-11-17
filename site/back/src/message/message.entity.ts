import Channel from '../channel/channel.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from '../user/user.entity';
import Receiver from 'src/receiver/receiver.entity';

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

  @ManyToOne(() => User, (usr) => usr.messages, { nullable: false, onDelete: 'CASCADE' })
  sender: User;

  @ManyToOne(() => Receiver, (rcv) => rcv.messages, { nullable: false, onDelete: 'CASCADE' })
  receiver: Receiver;
}
