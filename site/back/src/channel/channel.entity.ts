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
import UserEntity from '../user/user.entity';
import ReceiverEntity from '../receiver/receiver.entity';

@Entity()
export default class ChannelEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ default: false })
  isPrivate: boolean;

  @ManyToOne(
    () => UserEntity,
    (user: UserEntity) => user.ownedChannels,
    {
      nullable: false,
      onDelete: 'CASCADE'
    }
  )
  owner: UserEntity;

  @ManyToMany(
    () => UserEntity,
    (user: UserEntity) => user.channels
  )
  @JoinTable()
  users: UserEntity[];

  @OneToOne(
    () => ReceiverEntity,
    { cascade: true }
  )
  @JoinColumn()
  receiver: ReceiverEntity;
}
