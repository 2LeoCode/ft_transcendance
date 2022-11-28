import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import Channel from '../channel/channel.entity';
import User from '../user/user.entity';
import MessageEntity from './message.entity';

@Injectable()
export default class MessageService {
  constructor(
    @InjectRepository(MessageEntity) private messageRepository: Repository<MessageEntity>,
  ) {}

  async find(opts: {
    id?: string;
    createDate?: Date;
    updateDate?: Date;
    senderId?: string;
    receiverId?: string;
  }): Promise<MessageEntity[]> {
    return this.messageRepository.findBy(opts);
  }

  async insert(opts: {
    content: string;
    senderId: string;
    receiverId: string;
  }): Promise<InsertResult> {
    return this.messageRepository.insert({
      content: opts.content,
      sender: { id: opts.senderId } as User,
      receiver: { id: opts.receiverId } as Channel,
    });
  }

  async remove(id: string): Promise<MessageEntity[]> {
    return this.messageRepository.remove(await this.find({ id: id }));
  }

  async update(
    id: string,
    opts: {
      content?: string;
    },
  ): Promise<UpdateResult> {
    return this.messageRepository.update({ id: id }, opts);
  }
}
