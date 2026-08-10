function setup() {
    createCanvas(400, 400)
}
function draw() {
    background('#a4e0f071')
    circle(50, 60, 80)
    sayHello()
    drawBall(370, 370)
    drawBall(310, 310)
    drawBall(250, 250)
    drawBall(190, 190)
    drawBall(130, 130)

    drawBall(370, 30, '#ca2b2b')
    drawBall(310, 90, '#60b06aff')
    drawBall(250, 150, '#2b5cca')
    drawBall(140, 250, '#e8a32a')
    drawBall(80, 310, '#9a2aca')

}
function sayHello() {
    console.log('Hello')
}
function drawBall() {
    fill('#ca2b2b')
    circle(50, 50, 40)
}
function drawBall(x, y) {
    fill('#ca2b2b')
    circle(x, y, 40)
}
function drawBall(x, y, color) {
    fill(color)
    circle(x, y, 50)
}