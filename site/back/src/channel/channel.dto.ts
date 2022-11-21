import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateChannelDto {
	@ApiProperty({example: 'MyChannel'})
	name: string;

	@ApiProperty({example: 'foobar123'})
	password: string;

	@ApiProperty({example: false})
	isPrivate: boolean;

	@ApiProperty({example: 'ff9619c7-930e-42d2-9b30-8e2e29316665'})
	ownerId: string;
}

export class UpdateChannelDto {
	@ApiPropertyOptional({example: 'MyChannel'})
	name: string;

	@ApiPropertyOptional({example: 'foobar123'})
	password: string;

	@ApiPropertyOptional({example: false})
	isPrivate: boolean;
}
