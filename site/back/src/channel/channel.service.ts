import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './channel.entity';
import { ArrayContains, Repository, UpdateResult } from 'typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
  ) {}

  async find(opts: {
    id?: string;
    name?: string;
    isPrivate?: boolean;
    ownerId?: string;
  }): Promise<Channel[]> {
    return this.channelRepository.findBy({
      id: opts.id,
      name: opts.name,
      isPrivate: opts.isPrivate,
      owner: { id: opts.ownerId },
    });
  }

  async findByUser(usr: User): Promise<Channel[]> {
    return this.channelRepository.find({
      where: { users: ArrayContains([usr]) },
    });
  }

  async insert(opts: {
    name: string;
    password: string;
    isPrivate?: boolean;
    owner: User;
  }) {
    return this.channelRepository.insert(opts);
  }

  async remove(id: string): Promise<Channel[]> {
    return this.channelRepository.remove(await this.find({ id: id }));
  }

  async update(
    id: string,
    opts: {
      name?: string;
      password?: string;
      isPrivate?: boolean;
      users?: User[];
    },
  ): Promise<UpdateResult> {
    return this.channelRepository.update({ id: id }, opts);
  }
}
