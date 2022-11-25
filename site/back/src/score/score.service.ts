import { Injectable, UnauthorizedException } from '@nestjs/common';
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

	async add(userId: string, dto: CreateScoreDto): Promise<void> {
		await this.scoreRepository.save({
			user: { id: userId },
			playerScore: dto.playerScore,
			enemyScore: dto.enemyScore
		});
	}

	async remove(userId: string, id: string): Promise<void> {
		const curScore = await this.scoreRepository.findOne({
			relations: ['user'],
			where: {
				id: id,
			}
		});
		if (curScore.user.id !== userId)
			throw new UnauthorizedException();
		await this.scoreRepository.remove(await this.get({ id: id }));
	}
}
