import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import JwtGuard from 'src/auth/guards/jwt.guard';
import { UserId } from 'src/user/decorators/user-id.decorator';
import { CreateScoreDto } from './score.dto';
import ScoreEntity from './score.entity';
import ScoreService from './score.service';

@Controller('score')
@UseGuards(JwtGuard)
export default class ScoreController {
	constructor(
		private readonly scoreService: ScoreService
	) {}

//	@Get()
//	@ApiQuery({
//		type: String,
//		name: 'id',
//		required: false
//	})
//	@ApiQuery({
//		type: String,
//		name: 'userId',
//		required: false
//	})
//	async get(
//		@Query('id') id?: string,
//		@Query('userId') userId?: string,
//	): Promise<ScoreEntity[]> {
//		return this.scoreService.get({
//			id: id,
//			userId: userId
//		});
//	}
//
//	@Get('userId')
//	@ApiQuery({
//		type: String,
//		name: 'id',
//		required: true
//	})
//	async getUserId(id: string): Promise<string> {
//		return this.scoreService.getUserId(id);
//	}
//
//	@Post()
//	async post(
//		@UserId() userId: string,
//		@Body() dto: CreateScoreDto
//	): Promise<void> {
//		return this.scoreService.add(userId, dto);
//	}
//
//	@Delete()
//	@ApiQuery({
//		type: String,
//		name: 'id',
//		required: true
//	})
//	async delete(
//		@UserId() userId: string,
//		@Query('id') id: string
//	): Promise<void> {
//		return this.scoreService.remove(userId, id);
//	}
}
