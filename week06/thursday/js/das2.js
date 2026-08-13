function setup() {
    createCanvas(500, 400)
}
function draw() {
    background(0)
    let size = 100 + sin(frameCount * 0.05) * 50
    let r = 150 + sin(frameCount * 0.05) * 100
    fill(r, 150, 50)
    circle(250, 200, size)
}