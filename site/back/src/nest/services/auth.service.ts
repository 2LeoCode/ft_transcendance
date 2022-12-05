import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import UserEntity from '../entities/user.entity';
import UserService from './user.service';

@Injectable()
export default class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {}

	async validateUser(user42: string): Promise<UserEntity> {
		return this.userService.add({
			user42: user42
		});
	}

	async login(user: UserEntity) {
		const payload = { username: user.user42, sub: user.id };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}

	async verify(token: string): Promise<UserEntity> {
		return this.jwtService.verifyAsync(token);
	}

	async decode(token: string) {
		return this.jwtService.decode(token);
	}
}
