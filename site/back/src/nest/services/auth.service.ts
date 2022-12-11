import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import UserEntity from '../entities/user.entity';
import UserService from './user.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

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

	private code;


  //2fa starts here
 @InjectRepository(User) private userRepository: Repository<User>, private mailerService: MailerService) {
   this.code = Math.floor(10000 + Math.random() * 90000);

 async sendConfirmedEmail(user: UserEntity) {
   const { email, user42 } = user
   await this.mailerService.sendMail({
     to: user42 + "@student.42.fr", //user 42 login id + rest of text for email address 
     subject: 'Welcome to Transcendance App! Email Confirmed',
     template: 'confirmed',
     context: {
       user42,
       email
     },
   });
 }

 async sendConfirmationEmail(user: any) {
   const { email, user42 } = await user
   await this.mailerService.sendMail({
     to: user42 + "@student.42.fr",
     subject: 'Welcome to Transcendance App! Confirm Email',
     template: 'confirm',
     context: {
       user42,
       code: this.code
     },
   });

   async verifyAccount(code: String): Promise<any> {
	try{
	   const user = await this.userRepository.findOne({
		 authConfirmToken: code
	   });
	   if (!user) {
		 return new HttpException('Verification code has expired or not found', HttpStatus.UNAUTHORIZED)
	   }
	   await this.userRepository.update({ authConfirmToken: user.authConfirmToken }, { isVerified: true, authConfirmToken: undefined })
	   await this.sendConfirmedEmail(user)
	   return true
	}catch(e){
	   return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
	}
	}
}
