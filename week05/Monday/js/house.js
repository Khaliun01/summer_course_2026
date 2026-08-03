function setup() {
    createCanvas(400, 400);
}

function draw() {
    background('#8becf7ff');

    fill(255, 255, 0)
    circle(330, 70, 100)

    fill('#eee37dff');
    rect(100, 200, 200, 180);

    fill('#dc2b1bff')
    triangle(80, 200, 300, 200, 180, 100);

    fill('#882a2aff')
    rect(175, 280, 50, 100);

    fill('#a0eafbff');
    rect(125, 230, 50, 50);
    rect(225, 230, 50, 50);
}