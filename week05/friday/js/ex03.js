let doorX = 250;
let doorY = 200;
let doorWidth = 100;
let doorHeight = 150;
let doorColor = "#8b4513";
function setup() {
    createCanvas(700, 450)
}
function draw() {
    background('#87ceeb')
    rect(150, 100, 300, 250)
    let isMouseOnDoor = mouseX > doorX &&
        mouseX < doorX + doorWidth &&
        mouseY > doorY &&
        mouseY < doorY + doorHeight
    if (isMouseOnDoor && mouseIsPressed) {
        doorColor = "#2ecc71"
    } else if (isMouseOnDoor) {
        doorColor = "#f1c40f"
    } else {
        doorColor = "#8b4513"
    }
    fill(doorColor)
    rect(doorX, doorY, doorWidth, doorHeight)
    if (isMouseOnDoor && mouseIsPressed) {
        fill('#000')
        textSize(24)
        textAlign(CENTER, CENTER)
        text("OPEN", doorX + doorWidth / 2, doorY + doorHeight / 2)
    }
}