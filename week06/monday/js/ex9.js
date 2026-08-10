function setup() {
    createCanvas(600, 400)
}
function draw() {
    background("#f5f5f5")
    let ballX = 300
    let ballY = 200
    let mouseDistance = getDistance(mouseX, mouseY, ballX, ballY)
    if (mouseDistance < 100) {
        fill("red")
    } else {
        fill("blue")
    }
    circle(ballX, ballY, 80)
}
function getDistance(x1, y1, x2, y2) {
    let d = dist(x1, y1, x2, y2)
    return d
}