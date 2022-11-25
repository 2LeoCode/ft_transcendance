import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBody } from "@nestjs/swagger";
import AuthService from "./auth.service";

@Controller('auth')
export default class AuthController {
	constructor(
		private readonly authService: AuthService,
	) {}

	@Post('login')
	@UseGuards(AuthGuard('local'))
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				user42: {
					type: 'string'
				},
				password: {
					type: 'string'
				}
			}
		}
	})
	async login(
		@Req() req: any,
	): Promise<any> {
		return this.authService.login(req.user);
	}
}