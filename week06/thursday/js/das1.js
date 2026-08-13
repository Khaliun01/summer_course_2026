function setup(){
    createCanvas(600, 300)
}
function draw(){
    background(0)
    let x = frameCount % width
    fill ('#0309adff')
    circle (x, 150, 40)
}