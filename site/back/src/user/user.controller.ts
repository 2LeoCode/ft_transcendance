import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { InsertResult, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async get(
    @Query('id') id?: string,
    @Query('nick') nick?: string,
    @Query('mail') mail?: string,
    @Query('active') active?: boolean,
  ): Promise<User[]> {
    return this.userService.find({ id, nick, mail, active });
  }

  @Post()
  async post(
    @Body()
    dto: {
      nick: string;
      mail: string;
      firstName: string;
      lastName: string;
      password: string;
    },
  ): Promise<InsertResult> {
    return this.userService.insert(dto);
  }

  @Delete()
  async delete(@Query('id') id: string): Promise<User[]> {
    return this.userService.remove(id);
  }

  @Patch()
  async patch(
    @Query('id') id: string,
    @Body()
    dto: {
      nick?: string;
      mail?: string;
      firstName?: string;
      lastName?: string;
      password?: string;
      highestScore?: number;
      scoreHistory?: number[];
      active?: boolean;
      friendIds?: string[];
    },
  ): Promise<UpdateResult> {
    console.log(dto);
    return this.userService.update(id, {
      nick: dto.nick,
      mail: dto.mail,
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: dto.password,
      highestScore: dto.highestScore,
      scoreHistory: dto.scoreHistory,
      active: dto.active,
      friends: dto.friendIds.map((_id) => ({id: _id} as User))
    });
  }
}
