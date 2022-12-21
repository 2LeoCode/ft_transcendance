import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import UserEntity from '../entities/user.entity';
import UserService from './user.service';
import { toDataURL } from 'qrcode';
import { authenticator } from 'otplib';

@Injectable()
export default class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {}

	async validateUser(user42: string) {
		const exists = !!await this.userService.getOnePublic({ user42 });
		return {
			user: await this.userService.add({
				user42: user42
			}),
			exists: exists
		}
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

	async generateQrCodeDataURL(user: UserEntity) {
		const otpAuthUrl = authenticator.keyuri(user.user42, 'AUTH_TRANSCENDANCE', user.twoFactorSecret);
    return toDataURL(otpAuthUrl);
  }

	async verifyTwoFactorCode(user: UserEntity, code: string) {
		return authenticator.verify({
			token: code,
			secret: user.twoFactorSecret
		});
	}

	async loginWith2fa(user: Partial<UserEntity>) {
		const payload = {
      username: user.user42,
			sub: user.id,
      isTwoFactorAuthenticationEnabled: !!user.twoFactorSecret,
      isTwoFactorAuthenticated: true,
    };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}

}
