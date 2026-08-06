function setup(){
    createCanvas(600, 400)
}
function draw(){
    background('#f5f5f5')
    if(mouseY < height / 2){
        background('#2ecc71')
    }else{
        background('#9b59b6')
    }
    circle(mouseX, mouseY, 140)
}