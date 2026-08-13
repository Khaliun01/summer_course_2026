function setup() {
    createCanvas(400, 400)
}
function draw(){
    background(220)
    let angle = sin(frameCount * 0.03) * PI / 4
    let x = 200 + sin(angle) * 150
    let y = 100 + cos(angle) * 150

    line (200, 100, x, y)
    fill (255, 100, 100)
    circle (x, y, 30)
}