import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Logger,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { InsertResult, UpdateResult } from 'typeorm';
import { Channel } from '../channel/channel.entity';
import { User } from '../user/user.entity';
import { CreateMessageDto, UpdateMessageDto } from './message.dto';
import { Message } from './message.entity';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get()
  @ApiQuery({
    type: String,
    name: 'id',
    required: false
  })
  @ApiQuery({
    type: Date,
    name: 'createDate',
    required: false
  })
  @ApiQuery({
    type: Date,
    name: 'updateDate',
    required: false
  })
  @ApiQuery({
    type: String,
    name: 'senderId',
    required: false
  })
  @ApiQuery({
    type: String,
    name: 'type',
    required: false
  })
  @ApiQuery({
    type: String,
    name: 'receiverId',
    required: false
  })
  async get(
    @Query('id') id?: string,
    @Query('createDate') createDate?: Date,
    @Query('updateDate') updateDate?: Date,
    @Query('senderId') senderId?: string,
    @Query('type') type?: 'private' | 'channel',
    @Query('receiverId') receiverId?: string,
  ): Promise<Message[]> {
    if (type === undefined && receiverId !== undefined)
      Logger.warn('receiverId is ignored since type is not defined in GET /message request');
    return this.messageService.find({
      id,
      createDate,
      updateDate,
      senderId,
      type,
      receiverId,
    });
  }

  @Post()
  async post(
    @Body()
    dto: CreateMessageDto
  ): Promise<InsertResult> {
    if (dto.receiverId === undefined) {
     Logger.error('receiverId is undefined in POST /message request');
      throw new HttpException('Internal server error', 500);
    }
    if (dto.type === 'private') {
      return this.messageService.insert({
        content: dto.content,
        sender: { id: dto.senderId } as User,
        type: dto.type,
        channelReceiver: null,
        userReceiver: { id: dto.receiverId } as User,
      });
    }
    return this.messageService.insert({
      content: dto.content,
      sender: { id: dto.senderId } as User,
      type: dto.type,
      channelReceiver: { id: dto.receiverId } as Channel,
      userReceiver: null,
    });
  }

  @Delete()
  @ApiQuery({
    type: String,
    name: 'id',
    required: true
  })
  async delete(@Query('id') id: string): Promise<Message[]> {
    return this.messageService.remove(id);
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
    dto: UpdateMessageDto
  ): Promise<UpdateResult> {
    return this.messageService.update(id, dto);
  }
}
