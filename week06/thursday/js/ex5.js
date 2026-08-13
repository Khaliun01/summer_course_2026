let balls = []
function setup() {
    createCanvas(600, 450)
}
function draw() {
    background('#f5f5f5')
    for (let ball of balls) {
        fill(ball.r, ball.g, ball.b)
        circle(ball.x, ball.y, ball.size)
        ball.y = ball.y + ball.speed
        if (ball.y > height) {
            ball.y = 0
            ball.x = random(width)
        }
    }
    fill(0)
    textSize(20)
    text("Balls: " + balls.length, 20, 30)
}
function mousePressed() {
    balls.push({
        x: mouseX,
        y: mouseY,
        size: random(20, 50),
        speed: random(1, 5),
        r: random(100, 255),
        g: random(100, 255),
        b: random(100, 255)
    })
}