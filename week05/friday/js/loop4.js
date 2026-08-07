function setup() {
    createCanvas(700, 350)
}
function draw() {
    for (let i = 0; i < 5; i++) {
        circle(100 + i * 135, 175, 40 + i * 20)
    }
    fill('#9b59b6')
}