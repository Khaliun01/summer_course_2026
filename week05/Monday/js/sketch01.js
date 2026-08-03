function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(220);

    fill(255, 200, 0)
    circle(200, 200, 100);

    fill(0)
    circle(200, 200, 80)
    circle(330, 160, 20)
    

    line(270, 220, 330, 220)
    
    fill(155)
    rect(30, 20, 55, 25)

    describe('A white rectangle with a black outline on a gray canvas.');

    strokeWeight(5);
    point(50, 50);

    point(185, 20);

    square(-30, 20, 55);

    
    triangle(30, 75, 58, 20, 86, 75);

    ellipse(250, 250, 80, 40);

    strokeWeight(2);

    arc(50, 150, 80, 80, 0, PI + HALF_PI);
    
}