function setup() {
    createCanvas(500, 400)
}
function draw() {
    background(0)
    if(frameCount % 60 < 30){
        fill ('#f1c43fff')
    }else{
        fill ('#605f5fff')
    }
    circle (250, 200, 100)
}