import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { Express } from 'express';
import User from './user.entity';
import UserService from './user.service';
import Receiver from 'src/receiver/receiver.entity';

@Controller('user')
export default class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiQuery({
    type: String,
    name: 'id',
    required: false
  })
  @ApiQuery({
    type: String,
    name: 'nick',
    required: false
  })
  @ApiQuery({
    type: Boolean,
    name: 'online',
    required: false
  })
  async get(
    @Query('id') id?: string,
    @Query('nick') nick?: string,
    @Query('online') online?: boolean,
  ): Promise<User[]> {
    return this.userService.find({ id, nick, online });
  }

  @Post()
  async post(
    @Body() dto: CreateUserDto
  ): Promise<string> {
    const ret =  (await this.userService.insert(dto))
      .identifiers[0].id;
    Logger.log(await this.userService.logReceiverId(ret));
    return ret;
  }

  @Delete()
  @ApiQuery({
    type: String,
    name: 'id',
    required: true
  })
  async delete(@Query('id') id: string): Promise<User[]> {
    return this.userService.remove(id);
  }

  @Patch()
  @ApiQuery({
    type: String,
    name: 'id',
    required: true
  })
  async patch(
    @Query('id') id: string,
    @Body() dto: UpdateUserDto
  ): Promise<UpdateResult> {
    return (await this.userService.update(id, dto));
  }

  @Put('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiQuery({
    type: String,
    name: 'id',
    required: true
  })
  @ApiConsumes('image/*')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async putAvatar(
    @Query('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ): Promise<UpdateResult> {
    return this.userService.update(id, { avatar: file });
  }

  @Patch('friends')
  @ApiQuery({
    type: String,
    name: 'id',
    required: true
  })
  @ApiBody({
    schema: {
      type: 'array',
      items: {
        type: 'string',
      },
      example: ['123e4567-e89b-12d3-a456-426614174000', '987e6543-e21b-12d3-a456-426614100047']
    }
  })
  async patchFriends(
    @Query('id') id: string,
    @Body() friendIds: string[]
  ): Promise<User> {
    return this.userService.addFriends(id, friendIds);
  }
}
