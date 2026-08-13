let cars = []
function setup() {
    createCanvas(700, 450)
    let startY = 220
    let gap = 45
    for (let i = 0; i < 5; i++) {
        cars.push({
            x: random(width),
            y: startY + i * gap,
            speed: random(2, 6),
            w: random(50, 80),
            h: 25,
            r: random(100, 255),
            g: random(100, 255),
            b: random(100, 255)
        });
    }
}

function draw() {
    background('#87CEEB')

    fill('#2e7d32')
    rect(0, 150, width, 300)

    fill('#333333')
    rect(0, 180, width, 240)

    for (let lx = 0; lx < width; lx += 40) {
        line(lx, 300, lx + 20, 300)
    }
    for (let car of cars) {
        fill(car.r, car.g, car.b)
        rect(car.x, car.y, car.w, car.h, 5)

        fill('#000')
        circle(car.x + 15, car.y + car.h, 12)
        circle(car.x + car.w - 15, car.y + car.h, 12)
        car.x = car.x + car.speed

        if (car.x > width) {
            car.x = 0
            car.speed = random(2, 6)
            car.r = random(100, 255)
            car.g = random(100, 255)
            car.b = random(100, 255)
        }
    }
}