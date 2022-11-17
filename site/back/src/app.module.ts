import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserModule from './user/user.module';
import MessageModule from './message/message.module';
import ChannelModule from './channel/channel.module';
import SocketModule from './socket/socket.module';
import ReceiverModule from './receiver/receiver.module';
import ScoreModule from './score/score.module';

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
    SocketModule,
    ReceiverModule,
    ScoreModule
  ],
  controllers: [],
  providers: [],
})
export default class AppModule {}
