import { IBall, IPaddle, IRoom, GameState } from "./GameObject";

type paddle = {
    width: number;
    height: number;
    x:number;
	y:number;
}

export class Draw {
	gameCanvas: HTMLCanvasElement;
	gameContext: CanvasRenderingContext2D | null;
	gameWidth: number;
	gameHeight: number;
	gameX: number;
	gameY: number;
    keysPressed: boolean[] = [];
    playerScore: number;
	player2Score: number;
    // public static computerScore: number;
    player1: paddle;
	player2: paddle;
	ball: IBall;
	gameMode: number;


	constructor(canvas: HTMLCanvasElement) {
		this.gameCanvas = canvas;
		this.gameContext = this.gameCanvas.getContext("2d");
		this.gameWidth = 0;
		this.gameHeight = 0;
		this.gameX = 0;
		this.gameY = 0;
		this.playerScore = 0;
		this.player2Score = 0;

		
		if (this.gameCanvas.width > this.gameCanvas.height * 2){
			this.gameWidth = this.gameCanvas.height * 2;
			this.gameHeight = this.gameCanvas.height;
			this.gameX = this.gameCanvas.width / 2 - this.gameWidth / 2;
			this.gameY = this.gameCanvas.height / 2 - this.gameHeight / 2;
		}
		if (this.gameCanvas.height * 2 > this.gameCanvas.width){
			this.gameHeight = this.gameCanvas.width / 2;
			this.gameWidth = this.gameCanvas.width;
			this.gameX = this.gameCanvas.width / 2 - this.gameWidth / 2;
			this.gameY = this.gameCanvas.height / 2 - this.gameHeight / 2;
		}
        
		const paddleWidth = 3, paddleHeight = 10, ballSize = 2, wallOffset = 5;
		
		this.player1 = {
			width: paddleWidth,
			height: paddleHeight,
			x:wallOffset,
			y:100 / 2 - paddleHeight / 2		// pour x et y enleve peut etre et attend premiere update...			
		};

		this.player2 = {
			width: paddleWidth,
			height: paddleHeight,
			x:200 - (wallOffset + paddleWidth),
			y:100 / 2 - paddleHeight / 2		// pour x et y enleve peut etre et attend premiere update...			
		};

		this.ball = {
			width: ballSize,
			height: ballSize,
			x:200 / 2 - ballSize / 2,
			y:100 / 2 - ballSize / 2		// pour x et y enleve peut etre et attend premiere update...			
		};

		this.gameMode = 1;
        
	}
    drawBoardDetails(){
        
		//draw court outline
		if (this.gameContext){
			if (this.gameMode === 0 || this.gameMode === 1)
				this.gameContext.strokeStyle = "#fff";
			else if (this.gameMode === 2)
				this.gameContext.strokeStyle = "#540be1";
			this.gameContext.lineWidth = 5;
			this.gameContext.strokeRect(this.gameX, this.gameY, this.gameWidth - 5 , this.gameHeight - 5);
        
			//draw center lines
			for (let i = this.gameY; i + 20 < this.gameY + this.gameHeight; i += 20) {
				if (this.gameMode === 0 || this.gameMode === 1)
					this.gameContext.fillStyle = "#fff";
				else if (this.gameMode === 2)
					this.gameContext.fillStyle = "#d640fc";
				this.gameContext.fillRect(this.gameX + this.gameWidth / 2 - 10, i + 10, 15, 10);
			}
			
			//draw scores
				if (this.gameMode === 0 || this.gameMode === 1)
				this.gameContext.fillStyle = "#fff";
			else if (this.gameMode === 2)
				this.gameContext.fillStyle = "#1bf2a8";
			this.gameContext.textAlign = 'center';
			this.gameContext.font = "30px Orbitron";
			this.gameContext.fillText(this.playerScore.toString(), this.gameX + this.gameWidth / 4, this.gameY + this.gameHeight / 6);
			this.gameContext.fillText(this.player2Score.toString(), this.gameX + this.gameWidth / 4 * 3, this.gameY + this.gameHeight / 6);
		}
    }
    draw(){
		if (this.gameContext){
        this.gameContext.fillStyle = "#000";
        this.gameContext.fillRect(0,0,this.gameWidth,this.gameHeight);
		this.gameContext.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
              
		this.drawBoardDetails();
		
		if (this.gameMode === 0 || this.gameMode === 1)
			this.gameContext.fillStyle = "#fff";
		else if (this.gameMode === 2)
			this.gameContext.fillStyle = "#06f85c";
        this.gameContext.fillRect(this.gameX + this.player1.x / 200 * this.gameWidth, this.gameY + this.player1.y / 100 * this.gameHeight, this.player1.width / 200 * this.gameWidth, this.player1.height / 100 * this.gameHeight);

		if (this.gameMode === 0 || this.gameMode === 1)
			this.gameContext.fillStyle = "#fff";
		else if (this.gameMode === 2)
			this.gameContext.fillStyle = "#2856d4";
        this.gameContext.fillRect(this.gameX + this.player2.x / 200 * this.gameWidth, this.gameY + this.player2.y / 100 * this.gameHeight, this.player2.width / 200 * this.gameWidth, this.player2.height / 100 * this.gameHeight);

		if (this.gameMode === 0 || this.gameMode === 1)
			this.gameContext.fillStyle = "#fff";
		else if (this.gameMode === 2)
			this.gameContext.fillStyle = "#a9f103";
        this.gameContext.fillRect(this.gameX + this.ball.x / 200 * this.gameWidth, this.gameY + this.ball.y / 100 * this.gameHeight, this.ball.width / 200 * this.gameWidth, this.ball.height / 100 * this.gameHeight);
		}
	}stopGame(winner: string){
		// ending page.
		
		if (this.gameCanvas.width > this.gameCanvas.height * 2){
			this.gameWidth = this.gameCanvas.height * 2;
			this.gameHeight = this.gameCanvas.height;
			this.gameX = this.gameCanvas.width / 2 - this.gameWidth / 2;
			this.gameY = this.gameCanvas.height / 2 - this.gameHeight / 2;
		}
		if (this.gameCanvas.height * 2 > this.gameCanvas.width){
			this.gameHeight = this.gameCanvas.width / 2;
			this.gameWidth = this.gameCanvas.width;
			this.gameX = this.gameCanvas.width / 2 - this.gameWidth / 2;
			this.gameY = this.gameCanvas.height / 2 - this.gameHeight / 2;
		}

		//clear whole canva + draw ending page
		if (this.gameContext){
		this.gameContext.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
		this.drawBoardDetails();
		this.gameContext.clearRect(this.gameX + this.gameWidth / 2 - 20, this.gameY + this.gameHeight / 2 - 20, 40, 40);
		
		//get the ufc font for the scores and ending page
        // this.gameContext.font = 'ufc';
		this.gameContext.textAlign = 'center';
		this.gameContext.fillText(`${winner} wins!`, this.gameX + this.gameWidth / 2, this.gameY + this.gameHeight / 2 + 10);
		}
	}
    

	// clear() {
	// 	if (this.context)
	// 		this.context.clearRect(0, 0, this.width, this.height);
	// }

}