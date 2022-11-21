import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async find(opts: {
    id?: string;
    nick?: string;
    mail?: string;
    active?: boolean;
  }): Promise<User[]> {
    return this.userRepository.findBy(opts);
  }

  async insert(opts: {
    nick: string;
    mail: string;
    firstName: string;
    lastName: string;
    password: string;
  }): Promise<InsertResult> {
    return this.userRepository.insert(opts);
  }

  async remove(id: string): Promise<User[]> {
    return this.userRepository.remove(await this.find({ id: id }));
  }

  async update(
    id: string,
    opts: {
      nick?: string;
      mail?: string;
      firstName?: string;
      lastName?: string;
      password?: string;
      avatarPath?: string;
      highestScore?: number;
      scoreHistory?: number[];
      active?: boolean;
      friends?: User[];
    },
  ): Promise<UpdateResult> {
    return this.userRepository.update({ id: id }, opts);
  }
}
