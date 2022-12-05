import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';
import AuthService from '../services/auth.service';

@Injectable()
export default class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
	constructor(
		private readonly authService: AuthService,
	) {
		super({
			clientID: process.env.FORTYTWO_ID,
			clientSecret: process.env.FORTYTWO_SECRET,
			callbackURL: process.env.FORTYTWO_IP_REDIRECT,
			scope: ['public']
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile) {
		return this.authService.validateUser(profile.username);
	}
}
