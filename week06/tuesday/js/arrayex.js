let drops = []
function setup() {
    createCanvas(400, 400)
    for (let i = 0; i < 10; i++) {
        drops.push({
            x: random(width),
            y: random(height),
            speed: random(2, 6),
            size: random(10, 30)
        })
    }
}
function draw() {
    background('#22284cff')
    fill(200, 255, 189)

    noStroke()

    for (let d of drops) {
        circle(d.x, d.y, d.size)
        d.y = d.y + d.speed

        if (d.y > height) {
            d.y = 0;
        }
    }
}