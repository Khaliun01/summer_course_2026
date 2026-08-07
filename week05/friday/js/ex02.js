let lightColor = "#555555";
let roomColor = "#222222";
function setup() {
    createCanvas(600, 400)
}
function draw() {
    if(mouseIsPressed){
         roomColor = "#fff3b0"
        lightColor = "#ffd60a"
    }else{
        roomColor = "#222222"
        lightColor = "#555555"
    }
    background(roomColor)
    fill('#fffd87ff')
    circle(300, 10, 50)

    fill("#674309ff")
    rect(200, 320, 200, 20)
    rect(200, 338, 20, 70)
    rect(380, 338, 20, 70)
}