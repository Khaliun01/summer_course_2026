let fishX = -80
let fishSpeed = 2

function setup() {
    createCanvas(800, 500)
}

function draw() {
    background('#72dae0ff')
    noStroke()
    fill('#f8c27bff');
    rect(0, 420, 800, 80)

    for (let i = 0; i < 5; i++) {
        let gap = 70
        let x = fishX + 100
        let y = 80 + i * gap
        let w = 30 + i * 12
        let h = 20 + i * 8
        fill('#bb6727ff')
        let tailSize = w * 0.3
        triangle(
            x - w / 2, y,
            x - w / 2 - tailSize, y - tailSize,
            x - w / 2 - tailSize, y + tailSize
        )
        fill('#e4a656ff')
        ellipse(x, y, w, h)
        let eyeX = x + w * 0.25
        let eyeY = y - h * 0.15
        let eyeSize = h * 0.35
        fill('#fff')
        ellipse(eyeX, eyeY, eyeSize, eyeSize)
        fill('#000')
        ellipse(eyeX + 1, eyeY, eyeSize * 0.5, eyeSize * 0.5)
    }
    fishX += fishSpeed
    if (fishX > width + 100) {
        fishX = -150;
    }
}