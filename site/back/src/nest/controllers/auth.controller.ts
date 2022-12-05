import { Controller, Get, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import AuthService from '../services/auth.service';

@Controller('auth')
export default class AuthController {
	constructor(
		private readonly authService: AuthService,
	) {}

	@Get('login')
	@UseGuards(AuthGuard('42'))
	async login(
		@Req() req: any,
	): Promise<any> {
	}

	@Get('callback')
	@UseGuards(AuthGuard('42'))
	async callback(
		@Req() req: any,
		@Res({ passthrough: true }) res: any,
	): Promise<any> {
		const user = req.user;
		const token = await this.authService.login(user);
		res.cookie('token', token.access_token);
		res.redirect('http://localhost:3000/pong');
	}

}