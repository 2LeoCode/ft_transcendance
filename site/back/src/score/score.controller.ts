import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import { CreateScoreDto } from "./score.dto";
import ScoreService from "./score.service";

@Controller('score')
export default class ScoreController {
	constructor(private readonly scoreService: ScoreService) {}

	@Get()
	@ApiQuery({
		type: String,
		name: 'id',
		required: false
	})
	get(
		@Query('id') id?: string
	) {
		return this.scoreService.find({id: id});
	}

	@Post()
	post(
		@Body() dto: CreateScoreDto
	) {
		return this.scoreService.insert(dto);
	}

	@Delete()
	@ApiQuery({
		type: String,
		name: 'id',
		required: true
	})
	delete(
		@Query('id') id: string
	) {
		return this.scoreService.remove(id);
	}
}
