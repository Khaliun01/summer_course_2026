function setup() {
    createCanvas(600, 400)
}

function draw() {
    background("#f5f5f5")
    drawRobot(100, 220, 90, 55, 30, 90)
    drawRobot(300, 220, 170, 180, 250, 70)
    drawRobot(480, 220, 60, 100, 150, 255)
}

function calculateHeadSize(bodySize) {
    return bodySize * 0.6
}

function drawRobot(x, y, bodySize, r, g, b) {
    rectMode(CENTER)
    ellipseMode(CENTER)

    let headSize = calculateHeadSize(bodySize)

    fill(r, g, b)
    rect(x, y, bodySize, bodySize * 1.2)

    fill(r - 30, g - 30, b - 30)
    let headY = y - (bodySize * 1.2) / 2 - headSize / 2
    rect(x, headY, headSize, headSize)

    fill(255)
    let eyeOffset = headSize * 0.25
    let eyeY = headY - headSize * 0.1
    let eyeSize = headSize * 0.2
    circle(x - eyeOffset, eyeY, eyeSize)
    circle(x + eyeOffset, eyeY, eyeSize)

    fill(0)
    circle(x - eyeOffset, eyeY, eyeSize * 0.5)
    circle(x + eyeOffset, eyeY, eyeSize * 0.5)

    noFill()
    stroke(0)
    strokeWeight(2)
    let mouthY = headY + headSize * 0.15
    let mouthWidth = headSize * 0.4
    let mouthHeight = headSize * 0.3
    arc(x, mouthY, mouthWidth, mouthHeight, 0, PI)

    stroke(50)
    strokeWeight(4)
    line(x - bodySize / 2, y - bodySize * 0.3, x - bodySize * 0.8, y + bodySize * 0.2)
    line(x + bodySize / 2, y - bodySize * 0.3, x + bodySize * 0.8, y + bodySize * 0.2)

    line(x - bodySize * 0.25, y + bodySize * 0.6, x - bodySize * 0.25, y + bodySize * 1.1)
    line(x + bodySize * 0.25, y + bodySize * 0.6, x + bodySize * 0.25, y + bodySize * 1.1)
    noStroke()
}