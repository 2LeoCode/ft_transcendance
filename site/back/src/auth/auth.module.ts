import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import UserModule from 'src/user/user.module';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import JwtStrategy from './strategies/jwt.strategy';
import FortyTwoStrategy from './strategies/42.strategy';


@Module({
	imports: [
		UserModule,
		PassportModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '1d' },
		})
],
	controllers: [AuthController],
	providers: [
		AuthService,
		JwtStrategy,
		FortyTwoStrategy
	]
})
export default class AuthModule {}
