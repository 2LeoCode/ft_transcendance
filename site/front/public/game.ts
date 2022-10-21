
enum KeyBindings{
    UP = 38,
	DOWN = 40,
	W = 87,
	S = 83
}

class Game{

    private gameCanvas;
    private gameContext;
    public static keysPressed: boolean[] = [];
    public static playerScore: number = 0;
    public static player2Score: number = 0;
    // public static computerScore: number = 0;
    private player1: Paddle;
	private player2: Paddle2;
	//private computerPlayer: ComputerPaddle;
    private ball: Ball;
    constructor(){
        this.gameCanvas = document.getElementById("pong");
        this.gameContext = this.gameCanvas.getContext("2d");
        this.gameContext.font = "30px Orbitron";
        
        window.addEventListener("keydown",function(e){
           Game.keysPressed[e.which] = true;
        });
        
        window.addEventListener("keyup",function(e){
            Game.keysPressed[e.which] = false;
        });
        
        var paddleWidth:number = 5, paddleHeight:number = 20, ballSize:number = 2, wallOffset:number = 5;
		
		this.player1 = new Paddle(paddleWidth, paddleHeight, wallOffset, 100 / 2 - paddleHeight / 2); 
		this.player2 = new Paddle2(paddleWidth, paddleHeight, 200 - (wallOffset + paddleWidth) , 100 / 2 - paddleHeight / 2); 

        // this.player1 = new Paddle(paddleWidth,paddleHeight,wallOffset,this.gameCanvas.height / 2 - paddleHeight / 2); 
		// this.player2 = new Paddle2(paddleWidth,paddleHeight,this.gameCanvas.width - (wallOffset + paddleWidth) ,this.gameCanvas.height / 2 - paddleHeight / 2); 
		//this.computerPlayer = new ComputerPaddle(paddleWidth,paddleHeight,this.gameCanvas.width - (wallOffset + paddleWidth) ,this.gameCanvas.height / 2 - paddleHeight / 2);
        this.ball = new Ball(ballSize,ballSize,this.gameCanvas.width / 2 - ballSize / 2, this.gameCanvas.height / 2 - ballSize / 2);    
        
    }
    drawBoardDetails(){
        
        //draw court outline
        this.gameContext.strokeStyle = "#fff";
        this.gameContext.lineWidth = 5;
        this.gameContext.strokeRect(10,10,this.gameCanvas.width - 20 ,this.gameCanvas.height - 20);
        
        //draw center lines
        for (var i = 0; i + 30 < this.gameCanvas.height; i += 30) {
            this.gameContext.fillStyle = "#fff";
            this.gameContext.fillRect(this.gameCanvas.width / 2 - 10, i + 10, 15, 20);
        }
        
        //draw scores
        this.gameContext.textAlign = 'center';
        this.gameContext.font = "30px Orbitron";
        this.gameContext.fillText(Game.playerScore, this.gameCanvas.width / 4, this.gameCanvas.height / 6);
        this.gameContext.fillText(Game.player2Score, this.gameCanvas.width / 4 * 3, this.gameCanvas.height / 6);
        
    }
    update(){
        this.player1.update(this.gameCanvas);
        this.player2.update(this.gameCanvas);
        //this.computerPlayer.update(this.ball,this.gameCanvas);
        // this.ball.update(this.player1,this.computerPlayer,this.gameCanvas);
        this.ball.update(this.player1,this.player2,this.gameCanvas);
    }
    draw(){
        this.gameContext.fillStyle = "#000";
        this.gameContext.fillRect(0,0,this.gameCanvas.width,this.gameCanvas.height);
              
        this.drawBoardDetails();
        this.player1.draw(this.gameContext, this.gameCanvas);
		this.player2.draw(this.gameContext, this.gameCanvas);
		//this.computerPlayer.draw(this.gameContext);
        this.ball.draw(this.gameContext, this.gameCanvas);
	}
	stopGame(){
		// ending page with player1 wins.

		//clear whole canva
		this.gameContext.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
		
		//draw court outline
		this.gameContext.strokeStyle = "#fff";
		this.gameContext.lineWidth = 5;
		this.gameContext.strokeRect(10, 10, this.gameCanvas.width - 20, this.gameCanvas.height - 20);

		//draw center lines
		for (var i = 0; i + 30 < this.gameCanvas.height; i += 30) {
			this.gameContext.fillStyle = "#fff";
			this.gameContext.fillRect(this.gameCanvas.width / 2 - 10, i + 10, 15, 20);
		}
		
		this.gameContext.clearRect(this.gameCanvas.width / 2 - 20, this.gameCanvas.height / 2 - 20, 40, 40);
		
		//get the ufc font for the scores and ending page
        // this.gameContext.font = 'ufc';
		this.gameContext.textAlign = 'center';
		if (Game.playerScore == 7)
		this.gameContext.fillText("player one wins!", this.gameCanvas.width / 2, this.gameCanvas.height / 2 + 10);
		if (Game.player2Score == 7)
		this.gameContext.fillText("player two wins!", this.gameCanvas.width / 2, this.gameCanvas.height / 2 + 10);
	}
    gameLoop(){

		if (Game.playerScore == 7 || Game.player2Score == 7){
			game.stopGame();
			return ;
		}
		
        game.update();
        game.draw();
        requestAnimationFrame(game.gameLoop);
    }
}

class Entity{
    width:number;
    height:number;
    x:number;
    y:number;
    xVel:number = 0;
    yVel:number = 0;
    constructor(w:number, h:number, x:number, y:number){       
        this.width = w;
        this.height = h;
        this.x = x;
        this.y = y;
    }
    draw(context, canvas){

        context.fillStyle = "#fff";
        context.fillRect(this.x / 200 * canvas.width, this.y / 100 * canvas.height, this.width / 200 * canvas.width, this.height / 100 * canvas.height);
    }
}

class Paddle extends Entity{
    
    private speed:number = 1;
    
    constructor(w:number, h:number, x:number, y:number){
        super(w, h, x, y);
    }
    
    update(canvas){
     if( Game.keysPressed[KeyBindings.W] ){
        this.yVel = -1;
        if(this.y <= 5){
            this.yVel = 0
        }
     }else if(Game.keysPressed[KeyBindings.S]){
         this.yVel = 1;
         if(this.y + this.height >= 100 - 5){
             this.yVel = 0;
         }
     }else{
         this.yVel = 0;
     }
     
     this.y += this.yVel * this.speed;     
    }
}

class Paddle2 extends Entity{
    
    private speed:number = 1;
    
    constructor(w:number,h:number,x:number,y:number){
        super(w,h,x,y);
    }
    
    update(canvas){
     if( Game.keysPressed[KeyBindings.UP] ){
        this.yVel = -1;
        if(this.y <= 5){
            this.yVel = 0
        }
     }else if(Game.keysPressed[KeyBindings.DOWN]){
         this.yVel = 1;
         if(this.y + this.height >= 100 - 5){
             this.yVel = 0;
         }
     }else{
         this.yVel = 0;
     }
     
     this.y += this.yVel * this.speed;
    }
}

/*class ComputerPaddle extends Entity{
    
    private speed:number = 10;
    
    constructor(w:number,h:number,x:number,y:number){
        super(w,h,x,y);        
    }
    
    update(ball:Ball, canvas){ 
       
       //chase ball
       if(ball.y < this.y && ball.xVel == 1){
            this.yVel = -1; 
            
            if(this.y <= 20){
                this.yVel = 0;
            }
       }
       else if(ball.y > this.y + this.height && ball.xVel == 1){
           this.yVel = 1;
           
           if(this.y + this.height >= canvas.height - 20){
               this.yVel = 0;
           }
       }
       else{
           this.yVel = 0;
       }
       
        this.y += this.yVel * this.speed;

    }
    
}*/

class Ball extends Entity{
    
    private speed:number = 0.5;
    
    constructor(w:number,h:number,x:number,y:number){
        super(w,h,x,y);
        var randomDirection = Math.floor(Math.random() * 2) + 1; 
        if(randomDirection % 2){
            this.xVel = 1;
        }else{
            this.xVel = -1;
        }
        this.yVel = 1;
    }
    
    //update(player:Paddle,computer:ComputerPaddle,canvas){
	update(player:Paddle,player2:Paddle2,canvas){
       
        //check top canvas bounds
        if(this.y <= 5){
            this.yVel = 1;
        }
        
        //check bottom canvas bounds
        if(this.y + this.height >= 100 - 5){
            this.yVel = -1;
        }
        
        //check left canvas bounds
        if(this.x <= 0){  
            this.x = 200 / 2 - this.width / 2;
            Game.player2Score += 1;
        }
        
        //check right canvas bounds
        if(this.x + this.width >= 200){
            this.x = 200 / 2 - this.width / 2;
            Game.playerScore += 1;
        }
        
        
        //check player collision
        if(this.x <= player.x + player.width){
            if(this.y >= player.y && this.y + this.height <= player.y + player.height){
                this.xVel = 1;
            }
        }
        
        //check computer collision
        // if(this.x + this.width >= computer.x){
        //     if(this.y >= computer.y && this.y + this.height <= computer.y + computer.height){
        //         this.xVel = -1;
        //     }
		// }
		
		if(this.x + this.width >= player2.x){
            if(this.y >= player2.y && this.y + this.height <= player2.y + player2.height){
                this.xVel = -1;
            }
        }
       
        this.x += this.xVel * this.speed;
        this.y += this.yVel * this.speed;
    }
}

var game = new Game();
requestAnimationFrame(game.gameLoop);