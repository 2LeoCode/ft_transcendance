import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
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
					database: configService.get('DB_NAME'),
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
  controllers: [],
  providers: [],
})
export class AppModule {}
