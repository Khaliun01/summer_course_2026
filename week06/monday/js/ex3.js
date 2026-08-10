function setup() {
    createCanvas(600, 400)
}
function draw() {
    background("#f5f5f5")
    drawBall(100, 100)
    drawBall(300, 200)
    drawBall(500, 300)
}
function drawBall(x, y) {
    circle(x, y, 70)
}