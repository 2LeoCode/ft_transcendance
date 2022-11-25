import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import UserEntity from "src/user/user.entity";
import UserService from "src/user/user.service";

@Injectable()
export default class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {}

	private async check42User(user42: string, password: string): Promise<boolean> {
		// Ask 42 API if user is valid
		return true;
	}

	async validateUser(user42: string, password: string): Promise<UserEntity> {
		const isValid = await this.check42User(user42, password);
		if (!isValid)
			return null;
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
}