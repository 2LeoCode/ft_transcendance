import { User } from "./User";
import { GameMode } from "./Constants";

export let paddleWidth:number = 3, paddleHeight:number = 10, ballSize:number = 2, wallOffset:number = 5;

export class Game{

    public static playerScore: number = 0;
	public static player2Score: number = 0;
    // public static computerScore: number = 0;
    private player1: Paddle;
	private player2: Paddle2;
	//timing variables:
	private now: number = 0;
	private then: number = 0;
	private elapsed: number = 0;
	private fps: number = 10; // number of millisecond between each update.
	//private computerPlayer: ComputerPaddle;
    private ball: Ball;


    constructor(){}
}

export class Entity{
    id:string;
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
}

export class Paddle extends Entity{
    
    public gameMode: GameMode;
    private speed:number = 1;
    public ArrowUp:boolean = false;
    public ArrowDown:boolean = false;
    public score: number = 0;
    public user: User;
    
    constructor( user:User, w:number, h:number, x:number, y:number ) {
        super(w, h, x, y);
        this.user = user;
    }
    
    update() {
     if( this.ArrowUp === true ){
        this.yVel = -1;
        if(this.y <= 5){
            this.yVel = 0
        }
     } else if ( this.ArrowDown === true ) {
         this.yVel = 1;
         if(this.y + this.height >= 100 - 5){
             this.yVel = 0;
         }
     } else {
         this.yVel = 0;
     }
     
     this.y += this.yVel * this.speed;   
    }
}

export class Paddle2 extends Entity{
    
    public gameMode: GameMode;
    private speed:number = 1;
    public ArrowUp:boolean = false;
    public ArrowDown:boolean = false;
    public score: number = 0;
    public user: User;
    
    constructor( user:User, w:number, h:number, x:number, y:number ) {
        super(w, h, x, y);
        this.user = user;
    }
    
    update() {
     if ( this.ArrowUp === true ) {
        this.yVel = -1;
        if(this.y <= 5){
            this.yVel = 0
        }
     } else if ( this.ArrowDown === true ) {
         this.yVel = 1;
         if(this.y + this.height >= 100 - 5){
             this.yVel = 0;
         }
     } else {
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

export class Ball extends Entity{
    
    private speed:number = 1;
    public score1:number = 0;
    public score2:number = 0;
    
    constructor(w:number,h:number,x:number,y:number){
        super(w, h, x, y);
		var randomDirection = Math.floor(Math.random() * 2) + 1;
        if(randomDirection % 2){
            this.xVel = 1;
        }else{
            this.xVel = -1;
        }
        this.yVel = 1;
    }
    
    //update(player:Paddle,computer:ComputerPaddle,canvas){
	update(player:Paddle, player2:Paddle2){
       
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
            this.score2 += 1;

            if (player.gameMode === GameMode.SPEED && player2.gameMode === GameMode.SPEED) {
                this.speed *= 1.3;
            }
        }
        
        //check right canvas bounds
        if(this.x + this.width >= 200){
            this.x = 200 / 2 - this.width / 2;
            this.score1 += 1;

            if (player.gameMode === GameMode.SPEED && player2.gameMode === GameMode.SPEED) {
                this.speed *= 1.3;
            }
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