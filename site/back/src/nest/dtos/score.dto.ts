import { ApiProperty } from '@nestjs/swagger';

export class CreateScoreDto {
	@ApiProperty({example: 0})
	playerScore: number;

	@ApiProperty({example: 0})
	enemyScore: number;
}