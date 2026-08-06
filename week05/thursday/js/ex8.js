let buttonX = 200;
let buttonY = 150;
let buttonWidth = 200;
let buttonHeight = 80;
function setup() {
    createCanvas(600, 400)
    textAlign(CENTER, CENTER)
    textSize(25)
}
function draw() {
    background('#f5f5f5')
    let isMouseInside = mouseX > buttonX &&
        mouseX < buttonX + buttonWidth &&
        mouseY > buttonY &&
        mouseY < buttonY + buttonHeight
    if (isMouseInside && mouseIsPressed) {
        fill("#1e8449")
    } else if (isMouseInside) {
        fill("#2ecc71")
    } else {
        fill("#3498db")
    }
    rect(buttonX, buttonY, buttonWidth, buttonHeight, 10)
    text("START", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2)
}