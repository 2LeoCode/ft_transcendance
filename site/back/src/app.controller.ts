import { Controller, Get, UseGuards } from "@nestjs/common";
import JwtGuard from "./auth/guards/jwt.guard";

@Controller()
@UseGuards(JwtGuard)
export default class AppController {
	@Get('ping')
	async ping() {
		return 'pong';
	}
}
