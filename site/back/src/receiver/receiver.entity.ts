import Message from "src/message/message.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Receiver {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	type: 'User' | 'Channel';

	@OneToMany(() => Message, (msg) => msg.receiver, { cascade: true })
	messages: Message[];
}
