var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var KeyBindings;
(function (KeyBindings) {
    KeyBindings[KeyBindings["UP"] = 38] = "UP";
    KeyBindings[KeyBindings["DOWN"] = 40] = "DOWN";
    KeyBindings[KeyBindings["W"] = 87] = "W";
    KeyBindings[KeyBindings["S"] = 83] = "S";
})(KeyBindings || (KeyBindings = {}));
var Game = /** @class */ (function () {
    function Game() {
        this.gameWidth = 0;
        this.gameHeight = 0;
        this.gameX = 0;
        this.gameY = 0;
        //timing variables:
        this.now = 0;
        this.then = 0;
        this.elapsed = 0;
        this.fps = 10; // number of millisecond between each update.
        this.getCurrentTime = function () {
            var date = new Date();
            return date.getTime();
        };
        this.gameCanvas = document.getElementById("pong");
        this.gameContext = this.gameCanvas.getContext("2d");
        this.gameContext.font = "30px Orbitron";
        if (this.gameCanvas.width > this.gameCanvas.height * 2) {
            this.gameWidth = this.gameCanvas.height * 2;
            this.gameHeight = this.gameCanvas.height;
            this.gameX = this.gameCanvas.width / 2 - this.gameWidth / 2;
            this.gameY = this.gameCanvas.height / 2 - this.gameHeight / 2;
        }
        if (this.gameCanvas.height * 2 > this.gameCanvas.width) {
            this.gameHeight = this.gameCanvas.width / 2;
            this.gameWidth = this.gameCanvas.width;
            this.gameX = this.gameCanvas.width / 2 - this.gameWidth / 2;
            this.gameY = this.gameCanvas.height / 2 - this.gameHeight / 2;
        }
        window.addEventListener("keydown", function (e) {
            if (e.code == "ArrowUp") {
                console.log("ArrowUp pressed in .ts sa grand mere");
            }
            Game.keysPressed[e.which] = true;
        });
        window.addEventListener("keyup", function (e) {
            Game.keysPressed[e.which] = false;
        });
        this.then = this.getCurrentTime();
        var paddleWidth = 3, paddleHeight = 10, ballSize = 2, wallOffset = 5;
        this.player1 = new Paddle(paddleWidth, paddleHeight, wallOffset, 100 / 2 - paddleHeight / 2);
        this.player2 = new Paddle2(paddleWidth, paddleHeight, 200 - (wallOffset + paddleWidth), 100 / 2 - paddleHeight / 2);
        // this.player1 = new Paddle(paddleWidth,paddleHeight,wallOffset,this.gameHeight / 2 - paddleHeight / 2); 
        // this.player2 = new Paddle2(paddleWidth,paddleHeight,this.gameWidth - (wallOffset + paddleWidth) ,this.gameHeight / 2 - paddleHeight / 2); 
        //this.computerPlayer = new ComputerPaddle(paddleWidth,paddleHeight,this.gameWidth - (wallOffset + paddleWidth) ,this.gameHeight / 2 - paddleHeight / 2);
        this.ball = new Ball(ballSize, ballSize, 200 / 2 - ballSize / 2, 100 / 2 - ballSize / 2);
    }
    Game.prototype.drawBoardDetails = function () {
        //draw court outline
        this.gameContext.strokeStyle = "#fff";
        this.gameContext.lineWidth = 5;
        this.gameContext.strokeRect(this.gameX, this.gameY, this.gameWidth - 5, this.gameHeight - 5);
        //draw center lines
        for (var i = this.gameY; i + 20 < this.gameY + this.gameHeight; i += 20) {
            this.gameContext.fillStyle = "#fff";
            this.gameContext.fillRect(this.gameX + this.gameWidth / 2 - 10, i + 10, 15, 10);
        }
        //draw scores
        this.gameContext.textAlign = 'center';
        this.gameContext.font = "30px Orbitron";
        this.gameContext.fillText(Game.playerScore, this.gameX + this.gameWidth / 4, this.gameY + this.gameHeight / 6);
        this.gameContext.fillText(Game.player2Score, this.gameX + this.gameWidth / 4 * 3, this.gameY + this.gameHeight / 6);
    };
    Game.prototype.update = function () {
        // fps managment
        this.now = this.getCurrentTime();
        this.elapsed = this.now - this.then;
        if (this.elapsed < this.fps) {
            return;
        }
        else
            this.then = this.now;
        if (this.gameCanvas.width > this.gameCanvas.height * 2) {
            this.gameWidth = this.gameCanvas.height * 2;
            this.gameHeight = this.gameCanvas.height;
            this.gameX = this.gameCanvas.width / 2 - this.gameWidth / 2;
            this.gameY = this.gameCanvas.height / 2 - this.gameHeight / 2;
            this.gameContext.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
            this.drawBoardDetails();
        }
        if (this.gameCanvas.height * 2 > this.gameCanvas.width) {
            this.gameHeight = this.gameCanvas.width / 2;
            this.gameWidth = this.gameCanvas.width;
            this.gameX = this.gameCanvas.width / 2 - this.gameWidth / 2;
            this.gameY = this.gameCanvas.height / 2 - this.gameHeight / 2;
            this.gameContext.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
            this.drawBoardDetails();
        }
        this.player1.update();
        this.player2.update();
        //this.computerPlayer.update(this.ball);
        // this.ball.update(this.player1,this.computerPlayer);
        this.ball.update(this.player1, this.player2);
    };
    Game.prototype.draw = function () {
        this.gameContext.fillStyle = "#000";
        this.gameContext.fillRect(0, 0, this.gameWidth, this.gameHeight);
        this.drawBoardDetails();
        this.player1.draw(this.gameContext, this.gameWidth, this.gameHeight, this.gameX, this.gameY);
        this.player2.draw(this.gameContext, this.gameWidth, this.gameHeight, this.gameX, this.gameY);
        //this.computerPlayer.draw(this.gameContext);
        this.ball.draw(this.gameContext, this.gameWidth, this.gameHeight, this.gameX, this.gameY);
    };
    Game.prototype.stopGame = function () {
        // ending page.
        if (this.gameCanvas.width > this.gameCanvas.height * 2) {
            this.gameWidth = this.gameCanvas.height * 2;
            this.gameHeight = this.gameCanvas.height;
            this.gameX = this.gameCanvas.width / 2 - this.gameWidth / 2;
            this.gameY = this.gameCanvas.height / 2 - this.gameHeight / 2;
        }
        if (this.gameCanvas.height * 2 > this.gameCanvas.width) {
            this.gameHeight = this.gameCanvas.width / 2;
            this.gameWidth = this.gameCanvas.width;
            this.gameX = this.gameCanvas.width / 2 - this.gameWidth / 2;
            this.gameY = this.gameCanvas.height / 2 - this.gameHeight / 2;
        }
        //clear whole canva + draw ending page
        this.gameContext.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        this.drawBoardDetails();
        this.gameContext.clearRect(this.gameX + this.gameWidth / 2 - 20, this.gameY + this.gameHeight / 2 - 20, 40, 40);
        //get the ufc font for the scores and ending page
        // this.gameContext.font = 'ufc';
        this.gameContext.textAlign = 'center';
        if (Game.playerScore == 7)
            this.gameContext.fillText("player one wins!", this.gameX + this.gameWidth / 2, this.gameY + this.gameHeight / 2 + 10);
        if (Game.player2Score == 7)
            this.gameContext.fillText("player two wins!", this.gameX + this.gameWidth / 2, this.gameY + this.gameHeight / 2 + 10);
    };
    Game.prototype.gameLoop = function () {
        if (Game.playerScore == 0 && Game.player2Score == 0)
            game.draw();
        if (Game.playerScore == 7 || Game.player2Score == 7) {
            game.stopGame();
        }
        else {
            game.update();
            game.draw();
        }
        requestAnimationFrame(game.gameLoop);
    };
    Game.keysPressed = [];
    Game.playerScore = 0;
    Game.player2Score = 0;
    return Game;
}());
var Entity = /** @class */ (function () {
    function Entity(w, h, x, y) {
        this.xVel = 0;
        this.yVel = 0;
        this.width = w;
        this.height = h;
        this.x = x;
        this.y = y;
    }
    Entity.prototype.draw = function (context, width, height, gameX, gameY) {
        context.fillStyle = "#fff";
        context.fillRect(gameX + this.x / 200 * width, gameY + this.y / 100 * height, this.width / 200 * width, this.height / 100 * height);
    };
    return Entity;
}());
var Paddle = /** @class */ (function (_super) {
    __extends(Paddle, _super);
    function Paddle(w, h, x, y) {
        var _this = _super.call(this, w, h, x, y) || this;
        _this.speed = 1;
        return _this;
    }
    Paddle.prototype.update = function () {
        if (Game.keysPressed[KeyBindings.W]) {
            this.yVel = -1;
            if (this.y <= 5) {
                this.yVel = 0;
            }
        }
        else if (Game.keysPressed[KeyBindings.S]) {
            this.yVel = 1;
            if (this.y + this.height >= 100 - 5) {
                this.yVel = 0;
            }
        }
        else {
            this.yVel = 0;
        }
        this.y += this.yVel * this.speed;
    };
    return Paddle;
}(Entity));
var Paddle2 = /** @class */ (function (_super) {
    __extends(Paddle2, _super);
    function Paddle2(w, h, x, y) {
        var _this = _super.call(this, w, h, x, y) || this;
        _this.speed = 1;
        return _this;
    }
    Paddle2.prototype.update = function () {
        if (Game.keysPressed[KeyBindings.UP]) {
            this.yVel = -1;
            if (this.y <= 5) {
                this.yVel = 0;
            }
        }
        else if (Game.keysPressed[KeyBindings.DOWN]) {
            this.yVel = 1;
            if (this.y + this.height >= 100 - 5) {
                this.yVel = 0;
            }
        }
        else {
            this.yVel = 0;
        }
        this.y += this.yVel * this.speed;
    };
    return Paddle2;
}(Entity));
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
var Ball = /** @class */ (function (_super) {
    __extends(Ball, _super);
    function Ball(w, h, x, y) {
        var _this = _super.call(this, w, h, x, y) || this;
        _this.speed = 1.5;
        var randomDirection = Math.floor(Math.random() * 2) + 1;
        if (randomDirection % 2) {
            _this.xVel = 1;
        }
        else {
            _this.xVel = -1;
        }
        _this.yVel = 1;
        return _this;
    }
    //update(player:Paddle,computer:ComputerPaddle,canvas){
    Ball.prototype.update = function (player, player2) {
        //check top canvas bounds
        if (this.y <= 5) {
            this.yVel = 1;
        }
        //check bottom canvas bounds
        if (this.y + this.height >= 100 - 5) {
            this.yVel = -1;
        }
        //check left canvas bounds
        if (this.x <= 0) {
            this.x = 200 / 2 - this.width / 2;
            Game.player2Score += 1;
        }
        //check right canvas bounds
        if (this.x + this.width >= 200) {
            this.x = 200 / 2 - this.width / 2;
            Game.playerScore += 1;
        }
        //check player collision
        if (this.x <= player.x + player.width) {
            if (this.y >= player.y && this.y + this.height <= player.y + player.height) {
                this.xVel = 1;
            }
        }
        //check computer collision
        // if(this.x + this.width >= computer.x){
        //     if(this.y >= computer.y && this.y + this.height <= computer.y + computer.height){
        //         this.xVel = -1;
        //     }
        // }
        if (this.x + this.width >= player2.x) {
            if (this.y >= player2.y && this.y + this.height <= player2.y + player2.height) {
                this.xVel = -1;
            }
        }
        this.x += this.xVel * this.speed;
        this.y += this.yVel * this.speed;
    };
    return Ball;
}(Entity));
var game = new Game();
function startGame() {
    console.log("start game");
    requestAnimationFrame(game.gameLoop);
}
startGame();
