import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			usernameField: 'user42',
			passwordField: 'password',
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	async validate(payload: any) {
		return { userId: payload.sub, username: payload.username };
	}
}
