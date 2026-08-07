let ballX = 300;
let ballY = 200;
let ballSize = 100;
let ballColor = "#3498db";
let mouseDistance;
function setup() {
    createCanvas(600, 400)
}
function draw() {
    background('#f5f5f5')
    mouseDistance = dist(mouseX, mouseY, ballX, ballY)
    if(mouseDistance < 120){
        ballSize = 180
        fill('#e74c3c')
    }else{
        ballSize = 100
        fill(ballColor)
    }
    circle(ballX, ballY, ballSize)
}