let fishX = 80
let fishSpeed = 6
function setup() {
    createCanvas(800, 500)
}
function draw() {
    background("#87ceeb")
    fill("#e9c46a")
    noStroke()
    rect(0, 430, width, 70)
    if (fishX > width + 80) {
        fishX = -80
    }
    fishX = fishX + fishSpeed
    for (let i = 0; i < 5; i++) {
        let fishY = 90 + i * 75
        let fishSize = 55 + i * 5
        fill('#f4a261')
        ellipse(fishX, fishY, fishSize * 1.5, fishSize)
        fill('#e76f51')
        triangle(
            fishX - fishSize * 0.7,
            fishY,
            fishX - fishSize * 1.2,
            fishY - fishSize * 0.4,
            fishX - fishSize * 1.2,
            fishY + fishSize * 0.4)
        fill('#fff')
        circle(
            fishX + fishSize * 0.35,
            fishY - fishSize * 0.1,
            fishSize * 0.18)
        fill('#000')
        circle(
            fishX + fishSize * 0.37,
            fishY - fishSize * 0.1,
            fishSize * 0.08)
    }
}