function setup() {
    createCanvas(800, 800);
}

function draw() {
    stroke('#dfab28ff');     
    strokeWeight(10);         
    fill('#e0c146ff');       
    circle(400, 400, 400);  

    fill('#f996d0ff'); 
    circle(280, 430, 70);    
    circle(520, 430, 70);

    noStroke();               
    fill('#622b06ff');       
    arc(320, 350, 70, 90, PI, TWO_PI);    
    arc(480, 350, 70, 90, PI, TWO_PI);  


    arc(400, 430, 200, 160, 0, PI,) ;
}