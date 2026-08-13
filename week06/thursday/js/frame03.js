function setup() {
    createCanvas(400, 200)
}
function draw() {
    background("#06005dff")
    let d = (frameCount * 1.5) % 90 + 10

    fill ("#08cd99ff")
    circle (200, 100, d)
}
