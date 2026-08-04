let currentX = 0;
let circleY;
function setup() {
    createCanvas(600, 200);
    background(220);
    circleY = height / 2;
    noStroke();
}
function draw() {
    let g = map(currentX, 0, width, 0, 255);
    fill(255, g, 0);
    circle(currentX, circleY, 50)
    currentX = currentX + 2
}