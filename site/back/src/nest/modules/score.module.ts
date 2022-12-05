import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ScoreService from '../services/score.service';
import ScoreEntity from '../entities/score.entity';
import ScoreController from '../controllers/score.controller';

@Module({
	imports: [TypeOrmModule.forFeature([ScoreEntity])],
	controllers: [ScoreController],
	providers: [ScoreService],
	exports: [ScoreService]
})
export default class ScoreModule {}
