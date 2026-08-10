function setup() {
createCanvas(800, 300);
}
function draw() {
background("#f5f5f5");
fill("#3498db");
noStroke();
for (let i = 0; i < 10; i++) {
    let x = 50 + i * 70
    let y = 150
    let size = 20 + i * 5
    circle(x, y, size)
}
}