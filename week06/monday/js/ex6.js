function setup() {
    createCanvas(600, 400)
}
function draw() {
    background("#13ace8ff")
    drawFish(100, 100, 60)
    drawFish(300, 120, 90)
    drawFish(150, 280, 110)
    drawFish(450, 250, 80)
    drawFish(480, 40, 90)
}
function drawFish(x, y, size) {
    fill("#ea7514ff")
    triangle(
        x - size * 0.5, y,
        x - size * 0.9, y - size * 0.3,
        x - size * 0.9, y + size * 0.3
    )
    ellipse(x, y, size, size * 0.5);

    fill('#000')
    circle(x + size * 0.25, y - size * 0.1, size * 0.12)
}