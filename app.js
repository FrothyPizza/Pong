'use strict'


// window auto resize code
/*
// Initialize a new pixi application
const app = new PIXI.Application({
    autoResize: true,
    resolution: devicePixelRatio 
});
// Add the pixi view to the document
document.body.appendChild(app.view);

// Listen for window resize events
window.addEventListener('resize', resize);

// Resize window function
function resize() {
	// Resize the renderer
    app.renderer.resize(window.innerWidth, window.innerHeight);
  
}resize();
*/


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
    speed = 1;

    paddle.beginFill(0xFFFFFF); // white
    paddle.drawRect(0, 0, 50, 5);
    app.stage.addChild(paddle);
    paddle.x = app.screen.width/2; 
    paddle.y = app.screen.height - 20;


    ball.beginFill(0xFFFFFF);
    ballS = 5;
    ball.drawRect(0, 0, ballS, ballS);
    app.stage.addChild(ball);
    ball.x = app.screen.width/2;
    ball.y = app.screen.height/2;

    // start the ball in a random direction
    let radians = randInt(0, 360) * Math.PI/180;
    ballVelX = Math.cos(radians) * speed;
    ballVelY = Math.sin(radians) * speed;
} init();


// update
app.ticker.add((delta)=>{


    if(keys[39]) ++paddle.x;
    if(keys[37]) --paddle.x;
    if(keys[40]) ++paddle.y;
    if(keys[38]) --paddle.y;


    ball.x += ballVelX;
    ball.y += ballVelY;

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
          
    }
    // bounce off walls
    if(ball.x < 0) ballVelX *= -1;
    if(ball.x + ballS > app.screen.width) ballVelX *= -1;
    if(ball.y < 0) ballVelY *= -1;
    if(ball.y + ballS > app.screen.height) ballVelY *= -1;

    

})


function randInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}