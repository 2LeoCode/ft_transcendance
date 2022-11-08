import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { InsertResult, UpdateResult } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Express } from 'express';

@Controller('user')
export class UserController {
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
    type: String,
    name: 'mail',
    required: false
  })
  @ApiQuery({
    type: Boolean,
    name: 'active',
    required: false
  })
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
    @Body() dto: CreateUserDto
  ): Promise<InsertResult> {
    return this.userService.insert(dto);
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
    return this.userService.update(id, dto);
  }

  @Patch('avatar')
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
  async patchAvatar(
    @Query('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ): Promise<UpdateResult> {
    console.log(file);
    return this.userService.update(id, { avatarPath: file.path });
  }
}
