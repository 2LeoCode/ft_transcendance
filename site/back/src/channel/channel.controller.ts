import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Delete,
  Patch,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Channel } from './channel.entity';
import { User } from 'src/user/user.entity';
import { InsertResult, UpdateResult } from 'typeorm';

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Get()
  async get(
    @Query('id') id?: string,
    @Query('name') name?: string,
    @Query('isPrivate') isPrivate?: boolean,
    @Query('ownerId') ownerId?: string,
  ): Promise<Channel[]> {
    return this.channelService.find({ id, name, isPrivate, ownerId });
  }

  @Post()
  async post(
    @Body()
    dto: {
      name: string;
      password: string;
      isPrivate?: boolean;
      ownerId: string;
    },
  ): Promise<InsertResult> {
    return this.channelService.insert({
      name: dto.name,
      password: dto.password,
      isPrivate: dto.isPrivate,
      owner: { id: dto.ownerId } as User,
    });
  }

  @Delete()
  async delete(@Query('id') id: string): Promise<Channel[]> {
    return this.channelService.remove(id);
  }

  @Patch()
  async patch(
    @Query('id') id: string,
    @Body()
    dto: {
      name?: string;
      password?: string;
      isPrivate?: boolean;
      userIds?: string[];
    },
  ): Promise<UpdateResult> {
    return this.channelService.update(id, {
      name: dto.name,
      password: dto.password,
      isPrivate: dto.isPrivate,
      users: dto.userIds.map((_id) => ({id: _id} as User))
    });
  }
}
