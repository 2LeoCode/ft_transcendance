import User from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Score {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	playerScore: number;

	@Column()
	enemyScore: number;

	@CreateDateColumn()
	date: Date;

	@ManyToOne(() => User, user => user.scores, { onDelete: 'CASCADE' })
	user: User;
}
