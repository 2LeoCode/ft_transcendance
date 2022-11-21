import { ApiProperty } from "@nestjs/swagger";

export class CreateScoreDto {
	@ApiProperty({
		example: '123e4567-e89b-12d3-a456-426614174000'
	})
	userId: string;

	@ApiProperty({example: 0})
	playerScore: number;

	@ApiProperty({example: 0})
	enemyScore: number;
}