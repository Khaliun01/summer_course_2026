function setup() {
    createCanvas(600, 400)
}
function draw() {
    background("#f5f5f5")
    drawBall(100, 200, 60, 255, 0, 0)
    drawBall(200, 200, 70, 0, 255, 0)
    drawBall(300, 200, 80, 0, 0, 255)
}
function drawBall(x, y, size, r, g, b) {
    fill(r, g, b)
    circle(x, y, size)
}