import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { Message } from 'src/message/message.entity';
import { InsertResult, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  // Not sure
  @Get()
  async get(
	  @Query('id') id?: string,
	  @Query('nick') nick?: string,
		@Query('mail') mail?: string,
	  @Query('active') active?: boolean
  ): Promise<User[]>
  { return this.userService.find({id, nick, mail, active}); }

  @Post()
  async post(
    @Body() dto: {
      nick: string,
      email: string,
      firstName: string,
      lastName: string,
      password: string
    }
  ): Promise<InsertResult>
  { return this.userService.insert(dto); }

  @Delete()
  async delete(@Query('id') id: string): Promise<User[]>
  { return this.userService.remove(id); }

  @Patch()
  async patch(
    @Query('id') id: string,
    @Body() dto: {
      nick?: string,
			mail?: string,
      firstName?: string,
      lastName?: string,
      password?: string,
      highestScore?: number,
      scoreHistory?: number[],
      active?: boolean,
      friends?: User[]
    }
  ): Promise<UpdateResult>
  { return this.userService.update(id, dto); }
}
