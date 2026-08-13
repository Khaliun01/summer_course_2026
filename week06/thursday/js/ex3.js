let snowflakes = []
function setup() {
    createCanvas(600, 450)
    for (let i = 0; i < 40; i++) {
        let sz = random(3, 10)
        snowflakes.push({
            x: random(width),
            y: random(height),
            size: sz,
            speed: map(sz, 3, 10, 0.5, 2.5),
            drift: random(-0.5, 0.5),
        })
    }
}
function draw() {
    background("#0e0d5cff")
    for (let s of snowflakes) {
        fill('#fff')
        circle(s.x, s.y, s.size)
        s.y = s.y + s.speed
        s.x = s.x + s.drift
        if (s.y > height) {
            s.y = 0
            s.x = random(width)
        }
    }
}