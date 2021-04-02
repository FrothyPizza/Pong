'use strict'


const app = new PIXI.Application({
    width: 256,
    height: 256,
    antialias: true
});
document.body.appendChild(app.view);



let keys = [];
document.addEventListener('keydown', (event) => {
    keys[event.keyCode] = true;
});
document.addEventListener('keyup', (event) => {
    keys[event.keyCode] = false;
});

const START_SPEED = 2;

class Paddle{
    height; 
    width; 
    x; 
    y;
    rect;
    isBottom;
    speed;

    constructor(height, width, isBottom, speed=2){
        this.speed = speed;

        this.isBottom = isBottom;
        this.height = height;
        this.width = width;
        this.x = app.screen.width/2 - this.width/2;
        if(isBottom) this.y = app.screen.height - 20;
        else this.y = 20;

        this.rect = new PIXI.Graphics();
        this.rect.beginFill(0xFFFFFF); // white
        this.rect.drawRect(0, 0, width, height);
        app.stage.addChild(this.rect);

        this.reset();
    }

    reset(){
        if(this.isBottom) this.y = app.screen.height - 20;
        else this.y = 20;

        this.rect.x = this.x;
        this.rect.y = this.y;

    }

    move(dir, delta){
        this.x += dir * this.speed * delta;
        this.rect.x = this.x;
    }
}



class Ball{
    ball;
    size;
    x;
    y;
    yVel;
    xVel;
    speed;

    constructor(speed, size=5){
        this.x = app.screen.width/2;
        this.y = app.screen.height/3;

        this.xVel = 0;
        this.yVel = 0;
        
        this.speed = speed;

        this.ball = new PIXI.Graphics();

        this.ball.beginFill(0xFFFFFF);
        this.size = size;
        this.ball.drawRect(0, 0, this.size, this.size);
        app.stage.addChild(this.ball);


        this.reset();
    }

    reset(){
        this.x = app.screen.width/2;
        this.y = app.screen.height/2;

        let radians = randInt(0, 360) * Math.PI/180;
        this.xVel = Math.cos(radians);
        this.yVel = Math.sin(radians);

        this.speed = START_SPEED;
    }

    update(delta, paddles){
        // breakout style ball-paddle collision
        for(let paddle of paddles) {
            if(this.x + this.size > paddle.x &&
                this.x < paddle.x + paddle.width &&
                this.y + this.size > paddle.y &&
                this.y < paddle.y + paddle.height){
                    // find the position of the center of the ball
                    let ballCenter = this.x + this.size/2;
                    
                    // find where the ball is relative to the paddle (should be between 0 and paddle width)
                    let relativeToPaddle = paddle.x + paddle.width - ballCenter;
                    // (1 - (relativeToPaddle/paddleW) * 180) generates a number between 0 and 180 based on where the ball is relative to the paddle
                    let maxAngle = 70; maxAngle *= 2;
                    let angle = 1 - ((relativeToPaddle/paddle.width) * (maxAngle) + 180-maxAngle);
                    // convert the angle to radians
                    let rad = angle * Math.PI/180;
                    
                    // turn radians into a vector
                    this.xVel = Math.cos(rad);
                    this.yVel = Math.sin(rad);
                    if(!paddle.isBottom) this.yVel *= -1;

                    this.speed += 0.1;
                
            }
        }
        // bounce off walls
        if(this.x < 0) this.xVel *= -1;
        if(this.x + this.size > app.screen.width) this.xVel *= -1;
        if(this.y < 0) {    
            for(let paddle of paddles) paddle.reset();
            this.reset();
        }
        if(this.y + this.size > app.screen.height) {
            for(let paddle of paddles) paddle.reset();
            this.reset();
        }

        this.x += this.xVel * this.speed * delta;
        this.y += this.yVel * this.speed * delta;

        this.ball.x = this.x;
        this.ball.y = this.y;   
    }

    


}

let bottomPaddle;
let topPaddle;
let ball;

function init(){
    bottomPaddle = new Paddle(5, 50, true);
    topPaddle = new Paddle(5, 50, false);
    ball = new Ball(1);

    app.ticker.add(delta => update(delta));

} init();




function update(delta){
    if(keys[39]) bottomPaddle.move(1, delta);
    if(keys[37]) bottomPaddle.move(-1, delta);

    if(keys[65]) topPaddle.move(-1, delta);
    if(keys[68]) topPaddle.move(1, delta);


    ball.update(delta, [bottomPaddle, topPaddle]);

    
}



function randInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}