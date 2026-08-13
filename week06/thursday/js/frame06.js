function setup() {
    createCanvas(400, 400)
}
function draw() {
    background(220)
    let y = sin(frameCount * 0.05) * 50 + 200
    fill('#83082fff')
    circle(200, y, 40)
}