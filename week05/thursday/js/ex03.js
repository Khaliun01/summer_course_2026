let faceX;
let faceY;
let faceSize = 160;
let eyeSize = 20;
let eyeDistance = 35;
let eyeYPosition = 25;
let mouthWidth = 70;
function setup() {
    createCanvas(600, 400)
}
function draw() {
    faceX = mouseX
    faceY = mouseY
    background('#f5f5f5')
    fill('#f6eb0fff')
    noStroke()
    circle(faceX, faceY, faceSize)
    fill('#000')
    circle(faceX - eyeDistance, faceY - eyeYPosition, eyeSize);
    circle(faceX + eyeDistance, faceY - eyeYPosition, eyeSize)
    fill('#47272bff')
    stroke(0)
    strokeWeight(5)
    line(faceX - mouthWidth / 2, faceY + 10 , faceX + mouthWidth / 2, faceY )
}