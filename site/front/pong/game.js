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
        this.gameCanvas = document.getElementById("pong");
        this.gameContext = this.gameCanvas.getContext("2d");
        this.gameContext.font = "30px Orbitron";
        window.addEventListener("keydown", function (e) {
            Game.keysPressed[e.which] = true;
        });
        window.addEventListener("keyup", function (e) {
            Game.keysPressed[e.which] = false;
        });
        var paddleWidth = 20, paddleHeight = 60, ballSize = 10, wallOffset = 20;
        this.player1 = new Paddle(paddleWidth, paddleHeight, wallOffset, this.gameCanvas.height / 2 - paddleHeight / 2);
        this.player2 = new Paddle2(paddleWidth, paddleHeight, this.gameCanvas.width - (wallOffset + paddleWidth), this.gameCanvas.height / 2 - paddleHeight / 2);
        //this.computerPlayer = new ComputerPaddle(paddleWidth,paddleHeight,this.gameCanvas.width - (wallOffset + paddleWidth) ,this.gameCanvas.height / 2 - paddleHeight / 2);
        this.ball = new Ball(ballSize, ballSize, this.gameCanvas.width / 2 - ballSize / 2, this.gameCanvas.height / 2 - ballSize / 2);
    }
    Game.prototype.drawBoardDetails = function () {
        //draw court outline
        this.gameContext.strokeStyle = "#fff";
        this.gameContext.lineWidth = 5;
        this.gameContext.strokeRect(10, 10, this.gameCanvas.width - 20, this.gameCanvas.height - 20);
        //draw center lines
        for (var i = 0; i + 30 < this.gameCanvas.height; i += 30) {
            this.gameContext.fillStyle = "#fff";
            this.gameContext.fillRect(this.gameCanvas.width / 2 - 10, i + 10, 15, 20);
        }
        //draw scores
        this.gameContext.fillText(Game.playerScore, 280, 50);
        this.gameContext.fillText(Game.player2Score, 390, 50);
    };
    Game.prototype.update = function () {
        this.player1.update(this.gameCanvas);
        this.player2.update(this.gameCanvas);
        //this.computerPlayer.update(this.ball,this.gameCanvas);
        // this.ball.update(this.player1,this.computerPlayer,this.gameCanvas);
        this.ball.update(this.player1, this.player2, this.gameCanvas);
    };
    Game.prototype.draw = function () {
        this.gameContext.fillStyle = "#000";
        this.gameContext.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        this.drawBoardDetails();
        this.player1.draw(this.gameContext);
        this.player2.draw(this.gameContext);
        //this.computerPlayer.draw(this.gameContext);
        this.ball.draw(this.gameContext);
    };
    Game.prototype.stopGame1 = function () {
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
        this.gameContext.fillText("player one wins!", this.gameCanvas.width / 2, this.gameCanvas.height / 2 + 10);
    };
    Game.prototype.stopGame2 = function () {
        // ending page with player2 wins.
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
        //clear center line for text at ending page
        this.gameContext.clearRect(this.gameCanvas.width / 2 - 20, this.gameCanvas.height / 2 - 20, 40, 40);
        this.gameContext.textAlign = 'center';
        this.gameContext.fillText("player two wins!", this.gameCanvas.width / 2, this.gameCanvas.height / 2 + 10);
    };
    Game.prototype.gameLoop = function () {
        if (Game.playerScore == 7) {
            game.stopGame1();
            return;
        }
        if (Game.player2Score == 7) {
            game.stopGame2();
            return;
        }
        game.update();
        game.draw();
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
    Entity.prototype.draw = function (context) {
        context.fillStyle = "#fff";
        context.fillRect(this.x, this.y, this.width, this.height);
    };
    return Entity;
}());
var Paddle = /** @class */ (function (_super) {
    __extends(Paddle, _super);
    function Paddle(w, h, x, y) {
        var _this = _super.call(this, w, h, x, y) || this;
        _this.speed = 10;
        return _this;
    }
    Paddle.prototype.update = function (canvas) {
        if (Game.keysPressed[KeyBindings.W]) {
            this.yVel = -1;
            if (this.y <= 20) {
                this.yVel = 0;
            }
        }
        else if (Game.keysPressed[KeyBindings.S]) {
            this.yVel = 1;
            if (this.y + this.height >= canvas.height - 20) {
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
        _this.speed = 10;
        return _this;
    }
    Paddle2.prototype.update = function (canvas) {
        if (Game.keysPressed[KeyBindings.UP]) {
            this.yVel = -1;
            if (this.y <= 20) {
                this.yVel = 0;
            }
        }
        else if (Game.keysPressed[KeyBindings.DOWN]) {
            this.yVel = 1;
            if (this.y + this.height >= canvas.height - 20) {
                this.yVel = 0;
            }
        }
        else {
            this.yVel = 0;
        }
        this.y += this.yVel * this.speed;
        this.x = canvas.width;
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
        _this.speed = 4;
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
    Ball.prototype.update = function (player, player2, canvas) {
        //check top canvas bounds
        if (this.y <= 10) {
            this.yVel = 1;
        }
        //check bottom canvas bounds
        if (this.y + this.height >= canvas.height - 10) {
            this.yVel = -1;
        }
        //check left canvas bounds
        if (this.x <= 0) {
            this.x = canvas.width / 2 - this.width / 2;
            Game.player2Score += 1;
        }
        //check right canvas bounds
        if (this.x + this.width >= canvas.width) {
            this.x = canvas.width / 2 - this.width / 2;
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
requestAnimationFrame(game.gameLoop);
