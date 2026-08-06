let targetX;
let targetY;
let targetSize = 80;
let score = 0;
function setup() {
    createCanvas(600, 400)
    targetX = random(targetSize / 2, width - targetSize / 2)
    targetY = random(targetSize / 2, height - targetSize / 2)
}
function draw() {
    background('#f5f5f5')
    fill('#256f8cff')
    circle(targetX, targetY, targetSize);
    textSize(24)
    textAlign(LEFT, TOP)
    text("Score: " + score, 20, 20)
}
function mousePressed() {
    let d = dist(mouseX, mouseY, targetX, targetY)
    if(d <= targetSize / 2){
        score++
        targetX = random(targetSize / 2, width - targetSize / 2);
        targetY = random(targetSize / 2, height - targetSize / 2);
    }else{
        score--;
    }
}