import { InjectRepository } from "@nestjs/typeorm";
import User from "src/user/user.entity";
import { InsertResult, Repository } from "typeorm";
import { CreateScoreDto } from "./score.dto";
import Score from "./score.entity";

export default class ScoreService {
	constructor(
		@InjectRepository(Score)
		private scoreRepository: Repository<Score>,
	) {}

	async insert(dto: CreateScoreDto): Promise<InsertResult> {
		return this.scoreRepository.insert({
			playerScore: dto.playerScore,
			enemyScore: dto.enemyScore,
			user: { id: dto.userId } as User,
		});
	}

	async find(opts: {
		id?: string;
	}): Promise<Score[]> {
		return this.scoreRepository.findBy(opts);
	}

	async remove(id: string): Promise<Score[]> {
		return this.scoreRepository.remove(await this.find({ id: id }));
	}
}