import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm'
import { config } from 'process';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { MessageService } from './message/message.service';
import { MessageController } from './message/message.controller';
import { MessageModule } from './message/message.module';
import { ChannelService } from './channel/channel.service';
import { ChannelController } from './channel/channel.controller';
import { ChannelModule } from './channel/channel.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `env/${process.env.DB_ENVFILE}.env`
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          synchronize: true,
          autoLoadEntities: true
        }
      }
    }),
    UserModule,
    MessageModule,
    ChannelModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
