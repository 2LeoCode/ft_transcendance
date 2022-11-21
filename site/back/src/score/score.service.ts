import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateScoreDto } from './score.dto';
import { Repository } from 'typeorm';
import ScoreEntity from './score.entity';

@Injectable()
export default class ScoreService {
	constructor(
		@InjectRepository(ScoreEntity) private readonly scoreRepository: Repository<ScoreEntity>,
	) {}

	async get(opts: {
		id?: string;
		userId?: string;
	}): Promise<ScoreEntity[]> {
		return this.scoreRepository.find({
			where: {
				id: opts.id,
				user: { id: opts.userId }
			}
		});
	}

	async getUserId(id: string): Promise<string> {
		return this.scoreRepository.findOne({
			relations: ['user'],
			where: { id: id },
		}).then((score: ScoreEntity) => score.user.id);
	}

	async add(dto: CreateScoreDto): Promise<void> {
		await this.scoreRepository.save({
			user: { id: dto.userId },
			playerScore: dto.playerScore,
			enemyScore: dto.enemyScore
		});
	}

	async remove(id: string): Promise<void> {
		await this.scoreRepository.remove(await this.get({ id: id }));
	}
}
