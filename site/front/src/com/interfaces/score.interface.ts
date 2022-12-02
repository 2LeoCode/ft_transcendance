import PublicUser from './public-user.interface';

export default interface Score {
	id: string;
	playerScore: number;
	enemyScore: number;
	date: Date;
	user: PublicUser;
}
