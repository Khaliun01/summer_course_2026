let warningDistance = 70
function setup(){
    createCanvas(600, 400)
}
function draw(){
    if(mouseX < warningDistance || mouseX > width - warningDistance ){
        background('#e74c3c')
    }else{
        background('#3498db')
    }
    circle(mouseX, mouseY, 70)
}