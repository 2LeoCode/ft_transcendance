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
    senderId?: string
  }): Promise<Message[]> {
    return this.messageRepository.findBy({
      createDate: opts.createDate,
      updateDate: opts.updateDate,
      sender: { id: opts.senderId }
    });
  }

  async insert(opts: {
    content: string,
    date: Date,
    sender: User,
    receiver: User | Channel
  }): Promise<InsertResult>
  { return this.messageRepository.insert(opts); }

  async remove(id: string): Promise<Message[]>
  { return this.messageRepository.remove(await this.find({id: id})); }

  async update(id: string, opts: {
    content?: string
  }): Promise<UpdateResult>
  { return this.messageRepository.update({id: id}, opts); }
}
