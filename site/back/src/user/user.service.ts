import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Receiver from 'src/receiver/receiver.entity';
import ReceiverService from 'src/receiver/receiver.service';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import User from './user.entity';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly receiverService: ReceiverService,
  ) {}

  async find(opts: {
    id?: string;
    nick?: string;
    online?: boolean;
  }): Promise<User[]> {
    return this.userRepository.findBy(opts);
  }

  async logReceiverId(id: string) {
    Logger.log(await this.userRepository.find({
      relations: ['receiver'],
      where: { id: id }
    }));
  }

  async insert(dto: CreateUserDto): Promise<InsertResult> {
    const usr = {
      nick: dto.nick,
      receiver: await this.receiverService.insert('User')
    };
    return this.userRepository.insert(usr);
  }

  async remove(id: string): Promise<User[]> {
    await this.receiverService.remove((await this.find({ id: id }))[0].receiver.id);
    return this.userRepository.remove(await this.find({ id: id }));
  }

  async update(
    id: string,
    dto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return this.userRepository.update({ id: id }, dto);
  }

  async addFriends(id: string, friendIds: string[]): Promise<User> {
    const user = (await this.find({ id: id }))[0];
    user.friendIds = user.friendIds.concat(friendIds);
    return this.userRepository.save(user);
  }
}
