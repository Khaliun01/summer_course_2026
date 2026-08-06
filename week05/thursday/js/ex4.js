function setup(){
    createCanvas(600, 400)
}
function draw(){
    if(mouseX < width / 2 && mouseY < height / 2){
        background('#e74c3c')
    }else if(mouseX >= width / 2 && mouseY < height / 2){
        background('#3498db')
    }else if(mouseX < width / 2 && mouseY >= height / 2){
        background('#f1c40f')
    }else{
        background('#2ecc71')
    }
    circle(mouseX, mouseY, 30)
}