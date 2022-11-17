import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateScoreDto {
	@ApiProperty({example: 10})
	playerScore: number;

	@ApiProperty({example: 5})
	enemyScore: number;

	@ApiProperty({example: '123e4567-e21b-12d3-a456-426614174000'})
	userId: string;
}
