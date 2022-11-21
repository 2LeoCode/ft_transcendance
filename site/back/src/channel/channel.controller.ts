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
import { CreateChannelDto, UpdateChannelDto } from './channel.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Get()
  @ApiQuery({
    type: String,
    name: 'id',
    required: false
  })
  @ApiQuery({
    type: String,
    name: 'name',
    required: false
  })
  @ApiQuery({
    type: Boolean,
    name: 'isPrivate',
    required: false
  })
  @ApiQuery({
    type: String,
    name: 'ownerId',
    required: false
  })
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
    dto: CreateChannelDto
  ): Promise<InsertResult> {
    return this.channelService.insert({
      name: dto.name,
      password: dto.password,
      isPrivate: dto.isPrivate,
      owner: { id: dto.ownerId } as User,
    });
  }

  @Delete()
  @ApiQuery({
    type: String,
    name: 'id',
    required: true
  })
  async delete(@Query('id') id: string): Promise<Channel[]> {
    return this.channelService.remove(id);
  }

  @Patch()
  @ApiQuery({
    type: String,
    name: 'id',
    required: true
  })
  async patch(
    @Query('id') id: string,
    @Body()
    dto: UpdateChannelDto
  ): Promise<UpdateResult> {
    return this.channelService.update(id, {
      name: dto.name,
      password: dto.password,
      isPrivate: dto.isPrivate,
      users: dto.userIds.map((_id) => ({id: _id} as User))
    });
  }
}
