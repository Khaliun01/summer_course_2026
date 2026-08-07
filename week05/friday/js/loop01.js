function setup() {
    createCanvas(1000, 400)
}
function draw() {
    background('rgba(130, 117, 117, 0.33)')
    fill('#bcbcbcff')
   
    let x = 50
    for (let i = 0; i < 10; i++){
        circle(x, 50, 50)
        x = x + 100
    }

    for (let i = 0; i < 10; i++) {
        print(i);
    }

}
