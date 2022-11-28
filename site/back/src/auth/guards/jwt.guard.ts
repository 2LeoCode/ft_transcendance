import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export default class JwtGuard extends AuthGuard('jwt') {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		return super.canActivate(context);
	}

	handleRequest<TUser = any>(
		err: any,
		user: any,
		info: any,
		context: ExecutionContext,
		status?: any
	): TUser {
		info as void;
		status as void;
		if (err || !user)
			throw err || new UnauthorizedException();
		const request = context.switchToHttp().getRequest();
		request.headers['user-id'] = user.userId;
		return user;
	}
}
