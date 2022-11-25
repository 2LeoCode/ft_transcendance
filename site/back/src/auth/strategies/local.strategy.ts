import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import AuthService from '../auth.service';

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly authService: AuthService,
	) {
		super({
			usernameField: 'user42',
			passwordField: 'password'
		});
	}

	async validate(user42: string, password: string): Promise<any> {
		const user = await this.authService.validateUser(user42, password);
		if (!user)
			throw new UnauthorizedException();
		return user;
	}
}
