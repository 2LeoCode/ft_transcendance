import { Controller, UseGuards } from '@nestjs/common';
import JwtGuard from '../guards/jwt.guard';
import ScoreService from '../services/score.service';

@Controller('score')
@UseGuards(JwtGuard)
export default class ScoreController {
	constructor(
		private readonly scoreService: ScoreService
	) {}
}
