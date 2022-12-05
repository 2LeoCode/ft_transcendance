import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserModule from './user.module';
import MessageModule from './message.module';
import ChannelModule from './channel.module';
import ReceiverModule from './receiver.module';
import ScoreModule from './score.module';
import AuthModule from './auth.module';
import EventsModule from './events.module';
import { SocketModule } from '../../game/socket.module';
import { ChatModule } from './chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          port: configService.get('POSTGRES_PORT'),
          database: configService.get('POSTGRES_DB'),
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          synchronize: true,
          autoLoadEntities: true,
        };
      },
    }),
    UserModule,
    MessageModule,
    ChannelModule,
    ReceiverModule,
    ScoreModule,
    AuthModule,
    SocketModule,
    ChatModule,
    EventsModule
  ]
})
export default class AppModule {}
