function setup() {
    createCanvas(400, 400)
}
function draw() {
    background(220)
    let y = sin(frameCount * 0.05) * 100 + 200
    circle (200, y, 40)

    textSize(14)
    text("sin(frameCount * 0.05) = " +
        nf (sin(frameCount * 0.05), 1, 3), 20, 50)
}
