let circleX = 300;
let circleY = 200;
let circleColor = "#3498db";
let circleSize = 90;
function setup() {
    createCanvas(600, 400)
}
function draw() {
    background('#f5f5f5')
    fill(circleColor)
    circle(circleX, circleY, circleSize)
}
function mousePressed() {
    circleX = mouseX;
    circleY = mouseY;
    if (mouseX < width / 2) {
        circleColor = "#3498db"
    } else {
        circleColor = "#e67e22"
    }
}