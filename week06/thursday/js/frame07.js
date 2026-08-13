function setup() {
    createCanvas(400, 400)
}
function draw() {
    background(20)
    fill (255, 200, 0)
    circle (200, 200, 40)
    let a1 = frameCount * 0.05
    circle(200 + cos(a1) * 80, 200 + sin(a1) * 80, 15)

    let a2 = frameCount * 0.02
    fill(100, 200, 255)
    circle(200 + cos(a2) * 140, 200 + sin(a2) * 140, 25)

    let a3 = frameCount * 0.03
    fill('#09ce48ff')
    circle(200 + cos(a3) * 200, 200 + sin(a3) * 200, 15)

}