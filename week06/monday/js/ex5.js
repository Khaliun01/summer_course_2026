function setup() {
  createCanvas(600, 400)
}
function draw() {
  background("#13ace8ff")
  drawHouse(50, 200)
  drawHouse(230, 200)
  drawHouse(410, 200)
}
function drawHouse(x, y) {
  fill("#d13456ff")
  rect(x, y, 140, 120)

  fill("#44261bff")
  triangle(x - 10, y, x + 70, y - 60, x + 150, y)

  fill("#5d4037")
  rect(x + 55, y + 60, 30, 60)


  fill("#c2f7feff")
  rect(x + 15, y + 20, 30, 30)
  rect(x + 95, y + 20, 30, 30)
}