import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMessageDto {
	@ApiProperty({
		example: 'e0b9b9a0-5d6c-11eb-ae93-0242ac130002',
	})
	receiverId: string;

	@ApiProperty({
		example: 'Hello, world!',
	})
	content: string;
}

export class UpdateMessageDto {
	@ApiPropertyOptional({
		example: 'Hello, world!',
	})
	content?: string;
}
