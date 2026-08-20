let stars = []
let cars = []
let buildings = []
let shootingStar = { x: 0, y: 0, speedX: 0, speedY: 0, active: false }

function setup() {
    createCanvas(windowWidth, windowHeight)

    initStars()
    initBuildings()

    cars = [
        { x: 0, y: height - 52, speed: 4, color: "#ff5e5e", dir: 1 },
        { x: -180, y: height - 52, speed: 7, color: "#bd8dc2ff", dir: 1 },
        { x: width, y: height - 26, speed: -3, color: "#8be9fd", dir: -1 },
        { x: width + 180, y: height - 26, speed: -6, color: "#18a332ff", dir: -1 }
    ]

    resetShootingStar()
}

function initStars() {
    stars = []
    for (let i = 0; i < 400; i++) {
        stars.push({
            x: random(width),
            y: random(height * 0.85),
            size: random(1, 3),
            twinkle: random(0.02, 0.08)
        })
    }
}

function initBuildings() {
    let niit = 6
    let spacing = 15
    let niitSpacing = spacing * (niit + 1)
    let bWidth = (width - niitSpacing) / niit

    buildings = []
    let heights = [0.42, 0.28, 0.48, 0.22, 0.38, 0.30]

    for (let i = 0; i < niit; i++) {
        buildings.push({
            x: spacing + i * (bWidth + spacing),
            y: height * heights[i],
            w: bWidth,
            h: height,
            lightsOn: true
        })
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
    initStars()
    initBuildings()

    cars[0].y = height - 52
    cars[1].y = height - 52
    cars[2].y = height - 26
    cars[3].y = height - 26
}

function draw() {
    background('#110c21ff')

    drawSky()
    drawShootingStar()

    for (let b of buildings) {
        drawBuilding(b)
    }

    fill(20)
    noStroke()
    rect(0, height - 60, width, 60)

    stroke(255, 200, 100)
    strokeWeight(2)
    line(0, height - 30, width, height - 30)

    for (let car of cars) {
        drawCar(car)
    }
}

function drawSky() {
    noStroke()
    for (let s of stars) {
        let alpha = map(sin(frameCount * s.twinkle), -1, 1, 100, 255)
        fill(255, 255, 255, alpha)
        circle(s.x, s.y, s.size)
    }

    let moonX = width * 0.2
    let moonY = 100

    for (let r = 100; r > 50; r -= 10) {
        fill(255, 255, 220, 12)
        circle(moonX, moonY, r)
    }

    fill(245, 245, 220)
    circle(moonX, moonY, 60)
    fill('#110c21ff')
    circle(moonX - 18, moonY - 8, 50)
}

function resetShootingStar() {
    shootingStar.x = random(width * 0.1, width * 0.5)
    shootingStar.y = random(20, height * 0.2)
    shootingStar.speedX = random(6, 10)
    shootingStar.speedY = random(3, 6)
}

function drawShootingStar() {
    stroke(255, 255, 200, 200)
    strokeWeight(2)
    line(
        shootingStar.x,
        shootingStar.y,
        shootingStar.x - shootingStar.speedX * 3,
        shootingStar.y - shootingStar.speedY * 3
    )

    shootingStar.x += shootingStar.speedX
    shootingStar.y += shootingStar.speedY

    if (shootingStar.x > width || shootingStar.y > height * 0.5) {
        resetShootingStar()
    }
}

function drawBuilding(b) {
    fill("#191b28")
    stroke("#2a2d3e")
    strokeWeight(2)
    rect(b.x, b.y, b.w, b.h)

    drawWindows(b.x, b.y, b.w, b.h, b.lightsOn)
}

function drawWindows(bx, by, bw, bh, lightsOn) {
    let rows = 7
    let cols = 3
    let padX = bw / (cols + 1)
    let padY = (height - by - 70) / (rows + 1)

    noStroke()
    for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= cols; c++) {
            let wx = bx + c * padX - 8
            let wy = by + r * padY - 6

            if (lightsOn) {
                fill(255, 230, 150, 40)
                rect(wx - 2, wy - 2, 20, 16, 3)
                fill("#ffeaa7")
            } else {
                fill("#2b2b3a")
            }
            rect(wx, wy, 16, 12, 2)
        }
    }
}

function drawCar(car) {
    push()
    translate(car.x, car.y)

    noStroke()
    fill(car.color)
    rect(0, 0, 48, 14, 3)
    rect(12, -7, 24, 9, 2)

    fill("#6272a4")
    rect(15, -5, 18, 6, 1)

    fill(30)
    circle(10, 14, 8)
    circle(38, 14, 8)

    if (car.dir === 1) {
        fill(255, 250, 200, 50)
        triangle(48, 4, 90, -5, 90, 18)
        fill("#ffeaa7")
        rect(46, 3, 3, 5, 1)
        fill("#ff5555")
        rect(-1, 3, 2, 5, 1)
    } else {
        fill(255, 250, 200, 50)
        triangle(0, 4, -42, -5, -42, 18)
        fill("#ffeaa7")
        rect(-1, 3, 3, 5, 1)
        fill("#ff5555")
        rect(46, 3, 2, 5, 1)
    }

    pop()

    car.x += car.speed
    if (car.speed > 0 && car.x > width + 50) {
        car.x = -180
    } else if (car.speed < 0 && car.x < -180) {
        car.x = width + 50
    }
}

function mousePressed() {
    for (let b of buildings) {
        if (mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < height) {
            b.lightsOn = !b.lightsOn
        }
    }
}