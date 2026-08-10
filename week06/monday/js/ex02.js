let boxSize = 45;
let startX = 60;
let gap = 70;
function setup() {
createCanvas(800, 400);
rectMode(CENTER);
}
function draw() {
background("#f5f5f5");
for(let i = 0; i < 10; i++){
    let y = 50
    let x = startX + i * gap
    fill('#3498db')
    rect(x, y, boxSize, boxSize)
}
for(let i = 0; i< 10; i++){
    let y = 150
    let x = startX + i * gap
    fill('#e67e22')
    rect(x, y, boxSize, boxSize)
}
for(let i = 0; i< 10; i++){
    let y = 250
    let x = startX + i * gap
    fill('#2ecc71')
    rect(x, y, boxSize, boxSize)
}
}