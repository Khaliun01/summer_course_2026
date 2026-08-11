let balls = [
    { x: 100, y: 100, speed: 2 },
    { x: 300, y: 100, speed: 3 },
    { x: 50, y: 300, speed: 4 },
    { x: 350, y: 200, speed: 1 },
    { x: 200, y: 350, speed: 5 }
]
console.log(balls)

function setup() {
    createCanvas(600, 600)
    background('rgb(45, 181, 45)')
}
function draw() {
    fill('blue')
    circle(balls[0].x, balls[0].y, 30)

    fill('red')
    circle(balls[1].x, balls[1].y, 40)

    fill('pink')
    circle(balls[2].x, balls[2].y, 50)

    fill('yellow')
    circle(balls[3].x, balls[3].y, 55)

    fill('tomato')
    circle(balls[4].x, balls[4].y, 60)
    
}