function setup(){
    createCanvas(600, 400)
    background('#fff')
}
function draw(){
    stroke('#222')
    strokeWeight(3)
    for(let i = 0; i < 10; i++){
        let x = 50 + i * 55
        line(x, 50, x, 120)
    }
    for(let i = 0; i < 10; i++){
        let x = 50 + i * 55
        line(x, 140, x, 210)
    }
    for(let i = 0; i < 10; i++){
        let x = 50 + i * 55
        line(x, 230, x, 300)
    }
   
}