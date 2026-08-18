let scene = {
    size: 100,
    color: "#3498db",
    shape: "Square"
}

function setup() {
    const canvas = createCanvas(600, 400)
    canvas.parent("canvas-container")

    const sizeSlider = document.querySelector('#size-slider')
    const colorInput = document.querySelector('#color-input')
    const shapeSelector = document.querySelector('#shape-select')

    sizeSlider.addEventListener('input', function () {
        scene.size = Number(sizeSlider.value)
    })

    colorInput.addEventListener('input', function () {
        scene.color = colorInput.value
    })

    shapeSelector.addEventListener('change', function () {
        scene.shape = shapeSelector.value
    })
}

function draw() {
    background("#f5f5f5")
    drawShape(width / 2, height / 2, scene.size, scene.color, scene.shape)
}

function drawShape(x, y, size, color, shape) {
    fill(color)
    noStroke()
    if (shape.toLowerCase() === 'square') {
        rectMode(CENTER)
        square(x, y, size)
    } else {
        circle(x, y, size)
    }
}