function setup(){
    createCanvas(600, 600)
}
function draw(){
    background('#f5f5f5')
    fill('#1dba76')
    circle(300, 200, 120)
    print(7 > 6)
    let a = 6
    let b = 7.6
    print(a >= b)
    print(a < b)
    print(a <= b)
    print('Hello')

    print( a == b)
    print(a === b)
    print(2 == '2')
    print(2 === '2')
    print(mouseX)
    if (mouseX > 300) {
        fill('#9a2626ff')
        circle(300, 200, 120)
    }
        
}