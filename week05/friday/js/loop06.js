function setup() {
    createCanvas(850, 850)
}
function draw() {
    background('#f5f5f5')
    for (let i = 0; i < 5; i++) {
        let x = 80 + i * 170
        let y = 80
        let r = 0
        let g = i * 45
        let b = 160 - i * 10
        fill(r, g, b)
        circle(x, y, 130)
    }
    for (let i = 0; i < 5; i++) {
        let x = 80 + i * 170
        let y = 250
        let r = 50
        let g = i * 45
        let b = 150 - i * 5
        fill(r, g, b)
        circle(x, y, 130)
    }
    for (let i = 0; i < 5; i++) {
        let x = 80 + i * 170
        let y = 420
        let r = 110
        let g = i * 45
        let b = 150 - i * 5
        fill(r, g, b)
        circle(x, y, 130)
    }
    for (let i = 0; i < 5; i++) {
        let x = 80 + i * 170
        let y = 590
        let r = 170
        let g = i * 45
        let b = 150 - i * 5
        fill(r, g, b)
        circle(x, y, 130)
    }
    for (let i = 0; i < 5; i++) {
        let x = 80 + i * 170
        let y = 760
        let r = 220
        let g = i * 45
        let b = 130
        fill(r, g, b)
        circle(x, y, 130)
    }
}