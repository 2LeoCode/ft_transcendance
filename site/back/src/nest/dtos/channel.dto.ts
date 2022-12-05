import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChannelAccessibility, ChannelVisibility } from '../entities/channel.entity';

export class CreateChannelDto {
	@ApiProperty({example: 'MyChannel'})
	name: string;

	@ApiProperty({example: 'foobar123'})
	password: string;

	@ApiProperty({example: false})
	accessibility: ChannelAccessibility;

	@ApiProperty({example: false})
	visibility: ChannelVisibility;
}

export class UpdateChannelDto {
	@ApiPropertyOptional({example: 'MyChannel'})
	name?: string;

	@ApiPropertyOptional({example: 'foobar123'})
	password?: string;

	@ApiPropertyOptional({example: false})
	accessibility?: ChannelAccessibility;

	@ApiPropertyOptional({example: false})
	visibility?: ChannelVisibility;
}
