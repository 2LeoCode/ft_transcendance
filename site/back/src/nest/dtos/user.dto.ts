import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
	@ApiProperty({example: 'joe42'})
	user42: string;
}

export class UpdateUserDto {
	@ApiPropertyOptional({example: 'joe42'})
	nick?: string;

	@ApiPropertyOptional({example: true})
	online?: boolean;

	@ApiPropertyOptional({example: ['123e4567-e89b-12d3-a456-426614174000', '987e6543-e21b-12d3-a456-426614100047']})
	friendIds?: string[];

	avatar?: Express.Multer.File;
}
