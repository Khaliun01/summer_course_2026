let stars = []
function setup() {
    createCanvas(600, 400)
    for (let i = 0; i < 20; i++) {
        stars.push({
            x: random(width),
            y: random(height),
            speed: random(1, 5),
            size: random(3, 10),
            r: random(150, 255),
            g: random(150, 255),
            b: random(100, 255)
        })
    }
}
function draw() {
    background('#111827')
    for (let s of stars) {
        fill(s.r, s.g, s.b)
        circle(s.x, s.y, s.size)
        s.x = s.x + s.speed
        if (s.x > width) {
            s.x = 0
            s.y = random(height)
        }
    }
}