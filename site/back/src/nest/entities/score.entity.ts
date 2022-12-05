import UserEntity from './user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class ScoreEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	playerScore: number;

	@Column()
	enemyScore: number;

	@CreateDateColumn()
	date: Date;

	@ManyToOne(
		() => UserEntity,
		(user: UserEntity) => user.scores,
		{ onDelete: 'CASCADE' },
	)
	user: UserEntity;
}
