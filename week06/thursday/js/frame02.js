function setup() {
    createCanvas(400, 200)
}
function draw() {
    let r = (frameCount * 2) % 255
    background(r, 100, 150)

    fill (255)
    textSize(32)
    text("Red:" + nf(r, 0), 20, 100)
}
