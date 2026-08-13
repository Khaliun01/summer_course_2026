function setup() {
    createCanvas(600, 600)
}

function draw() {
    background(10, 10, 25)
    let centerX = width / 2
    let centerY = height / 2

    noStroke()
    fill(255, 204, 0)
    circle(centerX, centerY, 70)

    drawPlanet(centerX, centerY, 60, 0.04, 8, color(180, 180, 180))
    drawPlanet(centerX, centerY, 95, 0.028, 14, color(225, 185, 120))

    let earthPos = drawPlanet(centerX, centerY, 135, 0.02, 16, color(50, 150, 255))
    let moonAngle = frameCount * 0.08
    let moonX = earthPos.x + cos(moonAngle) * 18
    let moonY = earthPos.y + sin(moonAngle) * 18
    noStroke()
    fill(200)
    circle(moonX, moonY, 5)

    drawPlanet(centerX, centerY, 180, 0.016, 12, color(220, 80, 50))
    drawPlanet(centerX, centerY, 240, 0.009, 28, color(200, 140, 90))

    let saturnPos = drawPlanet(centerX, centerY, 300, 0.006, 22, color(210, 190, 140))
    noFill()
    stroke(180, 160, 120)
    strokeWeight(2)
    ellipse(saturnPos.x, saturnPos.y, 34, 14)
}

function drawPlanet(cx, cy, radius, speed, size, pColor) {
    noFill()
    stroke(255, 255, 255, 30)
    strokeWeight(1)
    ellipse(cx, cy, radius * 2, radius * 2)

    let angle = frameCount * speed
    let x = cx + cos(angle) * radius
    let y = cy + sin(angle) * radius

    noStroke()
    fill(pColor)
    circle(x, y, size)

    return { x: x, y: y }
}