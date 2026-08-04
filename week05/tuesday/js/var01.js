let WIDTH = 400;
let ELLIPSE = 200;

function setup() {
    let WIDTH = 400;
    let HEIGHT =400;
    createCanvas(WIDTH, HEIGHT);
}

function draw() {
    let RADIUS = 80;
    // 1. Sunset Sky
    background(255, 160, 122); // Light salmon

    // 2. The Sun
    noStroke();
    fill(255, 215, 0); // Gold
    ellipse(300, 100, 80, 80); // Placed in the top right

    // 3. The Ground
    fill(46, 139, 87); // Sea green
    rect(0, 300, WIDTH, 100);

    // 4. The Tree Trunk
    fill(101, 67, 33); // Dark brown
    rect(80, 200, 40, 120);

    // 5. The Tree Leaves (Overlapping circles)
    fill(34, 139, 34); // Forest green
    // Left leaf clump
    ellipse(70, ELLIPSE, 80, RADIUS);
    // Right leaf clump
    ellipse(130, ELLIPSE, 80, RADIUS);
    ellipse(140, ELLIPSE, 80, RADIUS);
    ellipse(150, ELLIPSE, 80, RADIUS);
    // Top center leaf clump
    ellipse(100, 160, 90, 90);
}