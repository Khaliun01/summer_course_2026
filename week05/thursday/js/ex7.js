let isPressed = false;
let circleSize = 100;
let circleColor = "#3498db";
function setup() {
    createCanvas(600, 400)
}
function draw() {
    background('#f5f5f5')
    if(isPressed){
        circleSize = 200
        circleColor = "#e74c3c"
    }else{
        circleSize = 100
        circleColor = "#3498db"
    }
    circle(width / 2, height / 2, circleSize)
}
function mousePressed() {
    isPressed = true
}
function mouseReleased() {
    isPressed = false
}