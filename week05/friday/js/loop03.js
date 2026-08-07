function setup() {
    createCanvas(600, 400)
    background('#fff')
}
function draw() {
    stroke('#222')
    strokeWeight(3)
    fill('#000')
    let size = 40
    let x = 100
    let gap = 40
    for (let i = 0; i < 6; i++) {
        let y = 20 + i * (size + gap)
        rect(x, y, size, size)
    }
}