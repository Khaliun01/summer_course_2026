function setup() {
    createCanvas(600, 600);
}

function draw() {
    if (mouseX < 200) {
        background('#9c1515ff')
    } else if (mouseX < 400) {
        background('#e1fe3fff')
    } else {
        background('#48d023ff')
    }

    // Хулганыг дагах дугуй
    circle(mouseX, mouseY, 120);
}