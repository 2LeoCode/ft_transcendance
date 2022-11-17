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
import { CreateMessageDto, UpdateMessageDto } from './message.dto';
import User from '../user/user.entity';
import Channel from '../channel/channel.entity';
import Message from './message.entity';
import MessageService from './message.service';

@Controller('message')
export default class MessageController {
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
    @Query('receiverId') receiverId?: string,
  ): Promise<Message[]> {
    return this.messageService.find({
      id,
      createDate,
      updateDate,
      senderId,
      receiverId
    });
  }

  @Post()
  async post(
    @Body()
    dto: CreateMessageDto
  ): Promise<InsertResult> {
    return this.messageService.insert(dto);
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
