import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import UserModule from './user.module';
import AuthController from '../controllers/auth.controller';
import AuthService from '../services/auth.service';
import JwtStrategy from '../strategies/jwt.strategy';
import FortyTwoStrategy from '../strategies/42.strategy';

@Module({
	imports: [
		UserModule,
		PassportModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '1h' },
		})
],
	controllers: [AuthController],
	providers: [
		AuthService,
		JwtStrategy,
		FortyTwoStrategy
	],
	exports: [AuthService]
})
export default class AuthModule {}
