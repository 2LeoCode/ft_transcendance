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
    @Query('senderId') senderId?: string
  ): Promise<Message[]>
  { return this.messageService.find({id, createDate, updateDate, senderId}); }

  @Post()
  async post(
    @Body() dto: {
      content: string,
      date: Date,
      sender: User,
      receiver: User | Channel
    }
  ): Promise<InsertResult>
  { return this.messageService.insert(dto); }

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
