import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { InsertResult, UpdateResult } from 'typeorm';
import { Channel } from '../channel/channel.entity';
import { User } from '../user/user.entity';
import { Message } from './message.entity';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  // Not sure
  @Get()
  async get(
    @Query('id') id?: string,
    @Query('createDate') createDate?: Date,
    @Query('updateDate') updateDate?: Date,
    @Query('senderId') senderId?: string,
    @Query('receiverType') receiverType?: 'user' | 'channel',
    @Query('receiverId') receiverId?: string
  ): Promise<Message[]>
  { return this.messageService.find({id, createDate, updateDate, senderId, receiverType, receiverId}); }

  @Post()
  async post(
    @Body() dto: {
      content: string,
      sender: User,
      receiverType: 'user' | 'channel',
      receiver: User | Channel
    }
  ): Promise<InsertResult>
  {
    if (dto.receiverType == 'user') {
      return this.messageService.insert({
        content: dto.content,
        sender: dto.sender,
        receiverType: 'user',
        channelReceiver: null,
        userReceiver: dto.receiver as User
      });
    }
    return this.messageService.insert({
      content: dto.content,
      sender: dto.sender,
      receiverType: 'channel',
      channelReceiver: dto.receiver as Channel,
      userReceiver: null
    });
  }

  @Delete()
  async delete(@Query('id') id: string): Promise<Message[]>
  { return this.messageService.remove(id); }

  @Patch()
  async patch(
    @Query('id') id: string,
    @Body() dto: {
      content?: string
    }
  ): Promise<UpdateResult>
  { return this.messageService.update(id, dto); }
}
