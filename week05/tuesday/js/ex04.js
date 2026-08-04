let size = 100;
let spacing = 20;
function setup() {
    createCanvas(600, 600)
}
function draw() {
    background('#a5f1f1ff')
    fill('#662a6cff')
    rect(50, 100, size, size)
    rect(50 + size + spacing, 100, size, size)
    rect(50 + (size + spacing) * 2, 100, size, size)
    rect(50 + (size + spacing) * 3, 100, size, size)
}