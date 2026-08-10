function setup() {
    createCanvas(600, 400)
}
function draw() {
    background("#13e8c1ff")
    drawBall(100, 200, 40)
    drawBall(270, 200, 80)
    drawBall(500, 200, 140)
}
function drawBall(x, y, size) {
    fill('#0a51bbff')
    circle(x, y, size)
}