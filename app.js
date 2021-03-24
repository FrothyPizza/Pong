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



let paddle = new PIXI.Graphics();

let speed;

let ballS;
let ball = new PIXI.Graphics();
let ballVelX, ballVelY;


function init(){

    paddle.beginFill(0xFFFFFF); // white
    paddle.drawRect(0, 0, 50, 5);
    app.stage.addChild(paddle);


    ball.beginFill(0xFFFFFF);
    ballS = 5;
    ball.drawRect(0, 0, ballS, ballS);
    app.stage.addChild(ball);

    reset();    

} init();


function reset(){
    speed = 1;

    paddle.x = app.screen.width/2 - paddle.width/2; 
    paddle.y = app.screen.height - 20;

    ball.x = app.screen.width/2;
    ball.y = app.screen.height/3;

    let radians = randInt(0, 360) * Math.PI/180;
    ballVelX = Math.cos(radians) * speed;
    ballVelY = Math.sin(radians) * speed;

}


// update
app.ticker.add((delta)=>{


    if(keys[39]) ++paddle.x;
    if(keys[37]) --paddle.x;
    if(keys[40]) ++paddle.y;
    if(keys[38]) --paddle.y;


    ball.x += ballVelX * speed;
    ball.y += ballVelY * speed;

    // breakout style ball-paddle collision
    if(ball.x + ballS > paddle.x &&
        ball.x < paddle.x + paddle.width &&
        ball.y + ballS > paddle.y &&
        ball.y < paddle.y + paddle.height){
            // find the position of the center of the ball
            let ballCenter = ball.x + ballS/2;
            
            // find where the ball is relative to the paddle (should be between 0 and paddle width)
            let relativeToPaddle = paddle.x + paddle.width - ballCenter;
            // (1 - (relativeToPaddle/paddleW) * 180) generates a number between 0 and 180 based on where the ball is relative to the paddle
            let angle = 1 - ((relativeToPaddle/paddle.width) * 140 + 20);
            // convert the angle to radians
            let rad = angle * Math.PI/180;
            
            // turn radians into a vector
            ballVelX = Math.cos(rad);
            ballVelY = Math.sin(rad);

            speed += 0.1;
          
    }
    // bounce off walls
    if(ball.x < 0) ballVelX *= -1;
    if(ball.x + ballS > app.screen.width) ballVelX *= -1;
    if(ball.y < 0) ballVelY *= -1;
    if(ball.y + ballS > app.screen.height) reset();

    

})


function randInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}