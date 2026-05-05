
let sizes = [];
let cols = 20; let rows = 20; let size = 10;
let xoff = 0; let yoff = 0; let inc = 0.1;
let zoff = 0;

function setup() {
  createCanvas(400, 400, WEBGL);
  rectMode(CENTER);
  angleMode(DEGREES);
}

function draw() {
  background(220);
  
  rotateX(-45);
  rotateY(45);
  
  xoff = 0;
  for (let i=0; i<cols; i++){
    sizes[i] = [];
    yoff = 0;
    for (let j=0; j<rows; j++){
      sizes[i][j] = map(noise(xoff, yoff, zoff), 0, 1, 0, 100);
      yoff += inc;
      
      let r = noise(zoff) * 255;
      let g = noise(zoff+15) * 255;
      let b = noise(zoff+30) * 255;
      
      fill(r, g, b);
      // noStroke();
      push();
      translate(i*size - 100, sizes[i][j], j*size - 100);
      // You can also put the second argument 100 with sizes[i][j] in the box() function instead of the translate function 
      box(size, 100, size); 
      pop();
       
      
      // rect(size/2 + i*size, size/2 + j*size, sizes[i][j], sizes[i][j]);
    }
    xoff += inc;
    zoff += 0.0001;
  }

  
}