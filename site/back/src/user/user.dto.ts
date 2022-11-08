import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { User } from "./user.entity";

export class CreateUserDto {
	@ApiProperty({example: 'joe42'})
	nick: string;

	@ApiProperty({example: 'joe42@42.fr'})
	mail: string;

	@ApiProperty({example: 'Joe'})
	firstName: string;

	@ApiProperty({example: 'Fortytwo'})
	lastName: string;

	@ApiProperty({example: 'lapin123'})
	password: string;
}

export class UpdateUserDto {
	@ApiPropertyOptional({example: 'joe42'})
	nick: string;

	@ApiPropertyOptional({example: 'joe42@42.fr'})
	mail: string;

	@ApiPropertyOptional({example: 'Joe'})
	firstName: string;

	@ApiPropertyOptional({example: 'Fortytwo'})
	lastName: string;

	@ApiPropertyOptional({example: 'lapin123'})
	password: string;

	@ApiPropertyOptional({example: 42})
	highestScore: number;

	@ApiPropertyOptional({example: [15, 24, 3]})
	scoreHistory: number[];

	@ApiPropertyOptional({example: true})
	active: boolean;

	@ApiPropertyOptional({example: ['123e4567-e89b-12d3-a456-426614174000', '987e6543-e21b-12d3-a456-426614100047']})
	friendIds: string[];
}
