import PublicUser from './interfaces/public-user.interface';

export default interface Score {
	id: string;
	playerScore: number;
	enemyScore: number;
	date: Date;
	user: PublicUser;
}
