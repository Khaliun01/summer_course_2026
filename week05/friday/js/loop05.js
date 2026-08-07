function setup() {
    createCanvas(800, 300)
}
function draw() {
    background('#f5f5f5')
    for (let i = 0; i < 10; i++) {
        let x = 50 + i * 75
        let y = 150
        let redValue = 50 + i * 20
        fill(redValue, 100, 180)
        circle(x, y, 55)
    }

}