function setup(){
    createCanvas(600, 400)
}
function draw(){
    if(width / 2 < mouseX){
        background('#3498db')
    } else{
        background('#e74c3c')
    }
    background('#fff')
    circle(mouseX, mouseY, 30)
}