import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { InsertResult, UpdateResult } from 'typeorm';
import { Channel } from '../channel/channel.entity';
import { User } from '../user/user.entity';
import { Message } from './message.entity';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get()
  async get(
    @Query('id') id?: string,
    @Query('createDate') createDate?: Date,
    @Query('updateDate') updateDate?: Date,
    @Query('senderId') senderId?: string,
    @Query('type') type?: 'private' | 'channel',
    @Query('receiverId') receiverId?: string,
  ): Promise<Message[]> {
    if (type === undefined && receiverId !== undefined)
      console.warn(
        '\x1b[31m[WARNING] receiverId is ignored since type is not defined in GET /message request',
      );
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
    dto: {
      content: string;
      senderId: string;
      type: 'private' | 'channel';
      receiverId: string;
    },
  ): Promise<InsertResult> {
    if (dto.receiverId === undefined) {
      console.error(
        '\x1b[31m[ERROR] receiverId is undefined in POST /message request',
      );
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
  async delete(@Query('id') id: string): Promise<Message[]> {
    return this.messageService.remove(id);
  }

  @Patch()
  async patch(
    @Query('id') id: string,
    @Body()
    dto: {
      content?: string;
    },
  ): Promise<UpdateResult> {
    return this.messageService.update(id, dto);
  }
}
