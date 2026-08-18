let stars = []
let cars = []
let buildings = []
let clouds = []

let shootingX, shootingY
let speedX = 8, speedY = 4

function setup() {
    createCanvas(800, 600)
    colorMode(RGB, 255)

    for (let i = 0; i < 160; i++) {
        let starColor;
        if (random(1) < 0.15) {
            starColor = color(180, 210, 255);
        } else {
            starColor = color(255, 255, 245);
        }

        let newStar = {
            x: random(width),
            y: random(height / 2),
            size: random(1, 3.2),
            glow: random(90, 255),
            twinkleSpeed: random(0.02, 0.07),
            hue: starColor
        }

        stars.push(newStar);
    }

    for (let i = 0; i < 4; i++) {
        clouds.push({
            x: random(width),
            y: random(20, 140),
            scale: random(0.6, 1.3),
            speed: random(0.1, 0.3),
            alpha: random(8, 18)
        })
    }

    shootingX = random(0, width * 0.4)
    shootingY = random(0, height * 0.1)

    buildings = [
        { x: -20, y: 300, w: 90, h: 300, lightsOn: true, color: "#0c0d16", hasAntenna: false, depth: 0.5 },
        { x: 60, y: 260, w: 100, h: 340, lightsOn: true, color: "#0e0f1c", hasAntenna: true, depth: 0.5 },
        { x: 720, y: 290, w: 95, h: 310, lightsOn: true, color: "#0d0e18", hasAntenna: false, depth: 0.5 },

        { x: 50, y: 250, w: 110, h: 350, lightsOn: true, color: "#14141e", hasAntenna: true, depth: 1 },
        { x: 190, y: 180, w: 140, h: 420, lightsOn: true, color: "#20202f", hasAntenna: false, depth: 1 },
        { x: 360, y: 220, w: 120, h: 380, lightsOn: true, color: "#191930", hasAntenna: true, depth: 1 },
        { x: 510, y: 150, w: 150, h: 450, lightsOn: true, color: "#1b1b28", hasAntenna: false, depth: 1 },
        { x: 680, y: 280, w: 100, h: 320, lightsOn: true, color: "#1e1e2f", hasAntenna: true, depth: 1 }
    ]

    cars = [
        { x: 0, y: 558, speed: 3.5, color: "#ff5e5e", dir: 1 },
        { x: 300, y: 574, speed: -2.0, color: "#8be9fd", dir: -1 },
        { x: 600, y: 558, speed: 4.5, color: "#ffb86c", dir: 1 },
        { x: 450, y: 574, speed: -6.0, color: "#c56bdc", dir: -1 }
    ]
}

function draw() {
    drawSky()

    noStroke()
    fill(189, 147, 249, 15)
    ellipse(200, 200, 400, 120)
    fill(255, 121, 198, 12)
    ellipse(500, 160, 450, 100)

    for (let c of clouds) {
        drawCloud(c)
        c.x += c.speed
        if (c.x > width + 150) c.x = -150
    }

    for (let s of stars) {
        let currentGlow = s.glow + sin(frameCount * s.twinkleSpeed) * 60
        push()
        let col = s.hue
        fill(red(col), green(col), blue(col), constrain(currentGlow, 20, 255))
        circle(s.x, s.y, s.size)
        pop()
    }

    for (let i = 0; i < 5; i++) {
        stroke(255, 255, 255, 255 - i * 40)
        strokeWeight(2 - i * 0.3)
        line(
            shootingX - (i * speedX * 0.3),
            shootingY - (i * speedY * 0.3),
            shootingX - 25 - (i * speedX * 0.3),
            shootingY - 12 - (i * speedY * 0.3)
        )
    }

    shootingX += speedX
    shootingY += speedY

    if (shootingX > width || shootingY > height * 0.5) {
        shootingX = random(0, width * 0.4)
        shootingY = random(0, height * 0.1)
    }

    drawMoon(700, 100)

    for (let b of buildings) {
        if (b.depth < 1) drawBuilding(b)
    }
    for (let b of buildings) {
        if (b.depth === 1) drawBuilding(b)
    }

    drawGroundHaze()

    fill("#12141d")
    rect(0, 540, width, 60)

    drawRoadReflections()

    stroke("#f4b674")
    strokeWeight(2)
    drawingContext.setLineDash([20, 15])
    line(0, 570, width, 570)
    drawingContext.setLineDash([])

    noStroke()
    for (let car of cars) {
        drawCar(car)
    }

    drawVignette()
}

function drawSky() {
    noStroke()
    for (let y = 0; y < height; y++) {
        let t = y / height
        let c1 = color(6, 8, 20)
        let c2 = color(23, 18, 46)
        let c3 = color(45, 25, 55)
        let col
        if (t < 0.35) {
            col = lerpColor(c1, c2, t / 0.35)
        } else {
            col = lerpColor(c2, c3, (t - 0.35) / 0.65)
        }
        stroke(col)
        line(0, y, width, y)
    }
}

function drawCloud(c) {
    push()
    translate(c.x, c.y)
    scale(c.scale)
    noStroke()
    fill(200, 190, 230, c.alpha)
    ellipse(0, 0, 140, 34)
    ellipse(40, -8, 100, 30)
    ellipse(-40, -6, 90, 26)
    pop()
}

function drawMoon(mx, my) {
    noStroke()
    for (let r = 90; r > 40; r -= 6) {
        fill(241, 250, 238, 6)
        circle(mx, my, r)
    }

    fill("#F1FAEE")
    circle(mx, my, 65)

    fill(210, 220, 210, 90)
    circle(mx - 10, my - 10, 12)
    circle(mx + 12, my + 8, 8)
    circle(mx - 5, my + 15, 10)
    circle(mx + 15, my - 12, 5)

    fill("#0B0E14")
    circle(mx - 18, my - 5, 55)
}

function drawBuilding(b) {
    push()
    if (b.depth < 1) {
        drawingContext.filter = "blur(1.5px)"
        fill(red(color(b.color)), green(color(b.color)), blue(color(b.color)), 200)
        noStroke()
    } else {
        fill(b.color)
        stroke("#282a36")
        strokeWeight(2)
    }
    rect(b.x, b.y, b.w, b.h, 4, 4, 0, 0)
    pop()

    if (b.depth < 1) return

    let grad = drawingContext.createLinearGradient(b.x, b.y, b.x + b.w, b.y)
    grad.addColorStop(0, "rgba(255,255,255,0.05)")
    grad.addColorStop(0.5, "rgba(255,255,255,0)")
    grad.addColorStop(1, "rgba(0,0,0,0.15)")
    drawingContext.fillStyle = grad
    drawingContext.fillRect(b.x, b.y, b.w, b.h)

    fill("#191b22")
    rect(b.x + 10, b.y - 10, 18, 10, 2)

    if (b.hasAntenna) {
        stroke("#5f6e9b")
        line(b.x + b.w / 2, b.y, b.x + b.w / 2, b.y - 25)
        let blink = (sin(frameCount * 0.1) + 1) / 2
        noStroke()
        fill(237, 80, 80, 150 + blink * 100)
        circle(b.x + b.w / 2, b.y - 25, 9 + blink * 4)
        fill("#ed5050")
        circle(b.x + b.w / 2, b.y - 25, 5)
    }

    let rows = 7
    let cols = 3
    let paddingX = b.w / (cols + 1)
    let paddingY = b.h / (rows + 1)

    noStroke()
    for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= cols; c++) {
            let wx = b.x + c * paddingX - 7
            let wy = b.y + r * paddingY - 7
            let flicker = noise(b.x * 0.1 + r, b.y * 0.1 + c, frameCount * 0.003) > 0.35

            if (b.lightsOn && flicker) {
                fill(255, 184, 108, 40)
                rect(wx - 2, wy - 2, 18, 16, 2)

                fill("#ffeaa7")
                rect(wx, wy, 14, 12, 2)

                fill(255, 255, 255, 60)
                rect(wx, wy, 5, 12, 1)
            } else {
                fill("#1b1c26")
                rect(wx, wy, 14, 12, 2)
                fill(70, 80, 120, 20)
                rect(wx, wy, 14, 5, 1)
            }
        }
    }
}

function drawGroundHaze() {
    noStroke()
    for (let i = 0; i < 6; i++) {
        fill(255, 184, 108, 3)
        rect(0, 500 + i * 6, width, 20)
    }
}

function drawRoadReflections() {
    for (let b of buildings) {
        if (b.depth !== 1) continue
        let midX = b.x + b.w / 2
        let colr = color(b.color)
        noStroke()
        for (let i = 0; i < 6; i++) {
            let a = map(i, 0, 6, 22, 2)
            fill(red(colr), green(colr), blue(colr), a)
            rect(b.x, 540 + i * 3, b.w, 3)
        }
    }
    noStroke()
    fill(255, 184, 108, 6)
    triangle(50, 540, 250, 540, 150, 600)
    fill(139, 233, 253, 5)
    triangle(500, 540, 700, 540, 600, 600)
}

function drawCar(car) {
    let facingRight = car.dir === 1

    push()
    translate(car.x + 20, car.y + 6)
    if (!facingRight) scale(-1, 1)
    translate(-20, -6)

    fill(255, 250, 200, 25)
    ellipse(65, 12, 50, 10)
    fill(255, 250, 200, 40)
    triangle(40, 2, 85, -8, 85, 18)

    if (facingRight) {
        fill(255, 0, 0, 180)
        rect(-2, 3, 3, 6, 1)
    } else {
        fill(255, 255, 255, 200)
        rect(-2, 3, 3, 6, 1)
    }

    fill(car.color)
    rect(0, 0, 40, 12, 3)
    rect(10, -6, 20, 8, 2)

    fill("#6272a4")
    rect(12, -5, 16, 5, 1)

    fill("#282a36")
    circle(8, 12, 8)
    circle(32, 12, 8)

    pop()

    car.x += car.speed
    if (car.speed > 0 && car.x > width + 85) {
        car.x = -85
    } else if (car.speed < 0 && car.x < -85) {
        car.x = width + 85
    }
}

function drawVignette() {
    noFill()
    let grad = drawingContext.createRadialGradient(
        width / 2, height / 2, height * 0.3,
        width / 2, height / 2, height * 0.85
    )
    grad.addColorStop(0, "rgba(0,0,0,0)")
    grad.addColorStop(1, "rgba(0,0,0,0.35)")
    drawingContext.fillStyle = grad
    drawingContext.fillRect(0, 0, width, height)
}

function mousePressed() {
    for (let b of buildings) {
        if (b.depth !== 1) continue
        if (mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h) {
            b.lightsOn = !b.lightsOn
        }
    }
}