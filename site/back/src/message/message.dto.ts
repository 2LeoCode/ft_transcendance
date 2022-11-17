import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateMessageDto {
	@ApiProperty({example: 'Hello World!'})
	content: string;

	@ApiProperty({example: 'ff9619c7-930e-42d2-9b30-8e2e29316665'})
	senderId: string;

	@ApiProperty({example: '9587a4f1-6099-463c-955d-779a0bbc54ff'})
	receiverId: string;
}

export class UpdateMessageDto {
	@ApiPropertyOptional({example: 'Hello World!'})
	content: string;
}
