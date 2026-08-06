function setup(){
    createCanvas(600, 400)
}
function draw(){
    if(mouseX < width / 2){
        background('#3498db')
    } else{
        background('#e67e22')
    }
    circle(mouseX, mouseY, 50)
}