let targetX = 100;
let targetY = 200;
let targetSize = 70;
let targetSpeed = 4;
let score = 0;
let lives = 3;
let gameState = "playing";
function setup() {
    createCanvas(600, 400)
}
function draw() {
    background('#f5f5f5')
    if (gameState === "playing") {
        targetX += targetSpeed
        if (targetX < targetSize / 2 || targetX > width - targetSize / 2) {
            targetSpeed = targetSpeed * -1;
        }
        fill('#2b6ea9ff')
        circle(targetX, targetY, targetSize)
    } else if (gameState === "gameOver") {
        fill("#e74c3c");
        textSize(40);
        textAlign(CENTER, CENTER);
        text("GAME OVER", width / 2, height / 2 - 20);

        textSize(18);
        fill(100);
        text("Restart (Double Click)", width / 2, height / 2 + 30)
    }
    fill(0);
    textSize(20);
    textAlign(LEFT, TOP)
    text("Score: " + score, 20, 20)
    text("Lives: " + lives, 20, 50)
}
function mousePressed() {
    if (gameState === "playing") {
        let d = dist(mouseX, mouseY, targetX, targetY);
        if (d <= targetSize / 2) {
            score++;
            if (targetSpeed > 0) {
                targetSpeed += 0.5;
            } else {
                targetSpeed -= 0.5;
            }
            targetY = random(targetSize / 2, height - targetSize / 2);
        } else {
            lives--;
            if (lives <= 0) {
                gameState = "gameOver";
            }
        }
    }
}
function doubleClicked() {
  if (gameState === "gameOver") {
    score = 0;
    lives = 3;
    targetSpeed = 4;
    targetX = 100;
    targetY = 200;
    gameState = "playing";
  }
}