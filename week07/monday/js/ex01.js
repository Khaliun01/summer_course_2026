let particles = []

const artPlan = {
    background: "#0d1b2a",
    palette1: ["#e0aaff", "#c77dff", "#7b2cbf"],
    palette2: ["#00f5d4", "#00bbf9", "#f15bb5"],
    palette3: ["#9b012f", "#c89def", "#06ece1"],
    currentColor: ["#e0aaff", "#c77dff", "#7b2cbf"],
    shape: "circle",
    count: 15,
    speed: 5
};

function setup() {
    createCanvas(600, 400)
    buildScene()
}

function draw() {
    background(artPlan.background)

    for (let p of particles) {
        p.x = p.x + p.vx
        p.y = p.y + p.vy

        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        noStroke()
        fill(p.color)

        if (artPlan.shape === "circle") {
            circle(p.x, p.y, p.size)
        } else if (artPlan.shape === "square") {
            rectMode(CENTER)
            square(p.x, p.y, p.size)
        } else if (artPlan.shape === "triangle") {
            let r = p.size / 2
            triangle(
                p.x, p.y - r,
                p.x - r, p.y + r,
                p.x + r, p.y + r
            )
        }
    }
}

function buildScene() {
    particles = []
    for (let i = 0; i < artPlan.count; i++) {
        particles.push({
            x: random(width),
            y: random(height),
            size: random(20, 50),
            vx: random(-artPlan.speed, artPlan.speed),
            vy: random(-artPlan.speed, artPlan.speed),
            color: random(artPlan.currentColor)
        });
    }
}

function mousePressed() {
    if (artPlan.shape === "circle") {
        artPlan.shape = "square"
        artPlan.currentColor = artPlan.palette2;
    } else if (artPlan.shape === "square") {
        artPlan.shape = "triangle"
        artPlan.currentColor = artPlan.palette3;
    } else {
        artPlan.shape = "circle"
        artPlan.currentColor = artPlan.palette1;
    }

    buildScene();
}