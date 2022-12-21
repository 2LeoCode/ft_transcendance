import { Body, Controller, Get, Logger, Post, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import AuthService from '../services/auth.service';
import { UserId } from '../decorators/user-id.decorator';
import UserService from '../services/user.service';
import JwtGuard from '../guards/jwt.guard';

@Controller('auth')
export default class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
	) {}

	@Get('login')
	@UseGuards(AuthGuard('42'))
	async login(
		@Req() req: any,
	): Promise<any> {
	}

	// DO NOT LET IN PRODUCTION
	// !!!!!!!!!!!!!!!!!!!!!!!!
	//@Get('bypass42')
	//async bypass42(
	//	@Query('user42') user42: string,
	//	@Res({ passthrough: true }) res: any,
	//): Promise<any> {
	//	const {user, exists} = await this.authService.validateUser(user42);
	//	const token = await this.authService.login(user);
	//	res.cookie('token', token.access_token);
	//	res.cookie('firstLogin', exists ? 'false' : 'true');
	//	res.redirect('http://localhost:3000');
	//}

	@Get('callback')
	@UseGuards(AuthGuard('42'))
	async callback(
		@Req() req: any,
		@Res({ passthrough: true }) res: any,
	): Promise<any> {
		const payload = req.user;
		const token = await this.authService.login(payload.user);
		res.cookie('token', token.access_token);
		res.cookie('firstLogin', payload.exists ? 'false' : 'true');
		res.redirect('http://localhost:3000');
	}

	@Get('2fa/login')
	@UseGuards(JwtGuard)
	async login2fa(
		@UserId() userId: string,
		@Res({ passthrough: true }) res: any,
		@Query('code') code: string
	): Promise<any> {
		const user = await this.userService.getOne(userId);
		const isCodeValid = await this.authService.verifyTwoFactorCode(user, code);
		if (!isCodeValid)
			throw new UnauthorizedException('Invalid two factor authentication code');
		const { access_token } = await this.authService.loginWith2fa(user);
		return { token_2fa: access_token };
	}

}
