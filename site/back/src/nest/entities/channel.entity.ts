import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import UserEntity from './user.entity';
import ReceiverEntity from './receiver.entity';

export type ChannelAccessibility = 'public' | 'private';
export type ChannelVisibility = 'visible' | 'hidden';

@Entity()
export default class ChannelEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ default: 'public' })
  accessibility: ChannelAccessibility;

  @Column({ default: 'visible' })
  visibility: ChannelVisibility;

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
    (user: UserEntity) => user.channels,
    { onUpdate: 'CASCADE' }
  )
  @JoinTable()
  users: UserEntity[];

  @Column('jsonb', {
    nullable: false,
    default: []
  })
  mutedIds: string[];

  @Column('jsonb', {
    nullable: false,
    default: []
  })
  bannedIds: string[];

  @Column('jsonb', {
    nullable: false,
    default: []
  })
  adminsIds: string[];

  @ManyToMany(
    () => UserEntity,
    (user: UserEntity) => user.channelInvites,
    { onUpdate: 'CASCADE', onDelete: 'CASCADE' }
  )
  @JoinTable()
  invites: UserEntity[];

  @OneToOne(
    () => ReceiverEntity,
    (receiver: ReceiverEntity) => receiver.parentChannel,
    { cascade: true, nullable: true }
  )
  @JoinColumn()
  receiver: ReceiverEntity;
}
