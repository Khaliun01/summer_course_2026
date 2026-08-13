let bubbles = []
function setup() {
    createCanvas(500, 500)
    for (let i = 0; i < 15; i++) {
        bubbles.push({
            x: random(width),
            y: random(height),
            speed: random(1, 4),
            size: random(15, 35)
        })
    }
}
function draw() {
    background('#97b0d7ff')
    for (let b of bubbles) {
        fill('#029660ff')
        circle(b.x, b.y, b.size)
        b.y = b.y - b.speed
        if (b.y < 0) {
            b.y = height
        }
    }
}