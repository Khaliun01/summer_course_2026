function setup() {
    createCanvas(800, 400)
}
function draw() {
    background(0)
    let centerY = height / 2
    let speed = 0.05
    let amplitude = 50
    for (let i = 0; i < 10; i++) {
        let x = 80 + i * 70
        let y = centerY + sin(frameCount * speed + i * 0.5) * amplitude
        fill('#9d064aff')
        circle(x, y, 20)
    }
}