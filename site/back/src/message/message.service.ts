import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../channel/channel.entity';
import { User } from '../user/user.entity';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(Message) private messageRepository: Repository<Message>
	) {}

  async find(opts: {
    id?: string,
    createDate?: Date,
    updateDate?: Date,
    senderId?: string,
		messageType?: 'private' | 'channel',
		receiverId?: string,
  }): Promise<Message[]> {
    if (opts.messageType === undefined)
      return this.messageRepository.findBy({
        createDate: opts.createDate,
        updateDate: opts.updateDate,
        sender: { id: opts.senderId }
      });
    if (opts.messageType === 'private')
      return this.messageRepository.findBy({
        createDate: opts.createDate,
        updateDate: opts.updateDate,
        sender: { id: opts.senderId },
        messageType: opts.messageType,
        userReceiver: { id: opts.receiverId }
      });
    return this.messageRepository.findBy({
      createDate: opts.createDate,
      updateDate: opts.updateDate,
      sender: { id: opts.senderId },
      messageType: opts.messageType,
      channelReceiver: { id: opts.receiverId }
    });
  }

  async insert(opts: {
    content: string,
    sender: User,
    messageType: 'private' | 'channel',
		channelReceiver: Channel,
		userReceiver: User
  }): Promise<InsertResult>
  { return this.messageRepository.insert(opts); }

  async remove(id: string): Promise<Message[]>
  { return this.messageRepository.remove(await this.find({id: id})); }

  async update(id: string, opts: {
    content?: string
  }): Promise<UpdateResult>
  { return this.messageRepository.update({id: id}, opts); }
}
