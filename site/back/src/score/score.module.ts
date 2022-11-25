import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ScoreService from './score.service';
import ScoreEntity from './score.entity';
import ScoreController from './score.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Module({
	imports: [TypeOrmModule.forFeature([ScoreEntity])],
	controllers: [ScoreController],
	providers: [ScoreService],
	exports: [ScoreService]
})
export default class ScoreModule {}
