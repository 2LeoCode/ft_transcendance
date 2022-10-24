import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
@TableInheritance({ column: {type: 'varchar', name: 'type'} })
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @ManyToOne(() => User, (usr) => usr.messages)
  sender: User;
};
