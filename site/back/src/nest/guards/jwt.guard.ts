import { ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import AuthService from '../services/auth.service';

@Injectable()
export default class JwtGuard extends AuthGuard('jwt') {

	

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		//const request = context.switchToHttp().getRequest();
		//const token = request.handshake.headers.cookie.split('token=')[1].split(';')[0].trim();
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
