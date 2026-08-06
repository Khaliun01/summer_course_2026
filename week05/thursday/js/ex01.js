let circleX;
let circleY;
let circleSize = 80;
let circleColor = "#3498db";
function setup() {
    createCanvas(600, 400)
}
function draw() {
    background('#f5f5f5')
    circleX = mouseX;
    circleY = mouseY;
    fill(circleColor)
    circle(circleX, circleY, circleSize)
}