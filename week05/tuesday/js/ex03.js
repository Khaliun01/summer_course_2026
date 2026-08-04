let count = 10;
function setup(){
    createCanvas(400, 400);
    let count = 50;
    print(50 + count);
}
function draw(){
    background(220);
    square(50, 50, count);
    print(50 + count)
    noLoop();
}