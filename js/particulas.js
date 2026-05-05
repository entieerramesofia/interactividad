//TODO: with simple circle blur straight forward.

var particles = [];
var noiseImg;
var n = 500;//number of particle
var noiseScale = 100;//noise scale;

function setup() {
  
  createCanvas(windowWidth, windowHeight);
  background(10);
  noiseDetail(1, 0);
  console.log(pixelDensity());
  //generate noise image
  genNoiseImg();
  image(noiseImg, 0, 0);
  
  //initialize particle
  resetParticles();
}

function resetParticles() {
  particles = [];

  for(var i=0; i<n; i++){
    var particle = new Object();
    
    particle.pos = createVector(random(width), random(height));
    particles.push(particle);//add particle to particle list
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(10);
  genNoiseImg();
  image(noiseImg, 0, 0);
  resetParticles();
}


//get gradient vector
function curl(x, y){
  var EPSILON = 0.001;//sampling interval
  //Find rate of change in X direction
  var n1 = noise(x + EPSILON, y);
  var n2 = noise(x - EPSILON, y);
  //Average to find approximate derivative
  var cx = (n1 - n2)/(2 * EPSILON);

  //Find rate of change in Y direction
  n1 = noise(x, y + EPSILON);
  n2 = noise(x, y - EPSILON);

  //Average to find approximate derivative
  var cy = (n1 - n2)/(2 * EPSILON);
  
  //return new createVector(cx, cy);//gradient toward higher position
  return createVector(cy, -cx);//rotate 90deg
}

function draw() {
  tint(255, 4);
  image(noiseImg, 0, 0);//fill with transparent noise image
  //fill(0, 4);
  //rect(0, 0, width, height);
  
  strokeWeight(4);//particle size
  stroke(255);
  
  
  for(var i=0; i<particles.length; i++){
    var p = particles[i];//pick a particle
    p.pos.add(curl(p.pos.x/noiseScale, p.pos.y/noiseScale));
    point(p.pos.x, p.pos.y);
  }
}

function genNoiseImg(){
  noiseImg = createGraphics(width, height);
  noiseImg.loadPixels();
  var widthd = width*pixelDensity();
  var heightd = height*pixelDensity();
  for(var i=0; i<widthd; i++){
    for(var j=0; j<heightd; j++){
      var x = i/pixelDensity();
      var y = j/pixelDensity();
      var bright = pow(noise(x/noiseScale, y/noiseScale)-0.3, 1/2.0)*400;
      noiseImg.pixels[(i+j*widthd)*4] = bright;
      noiseImg.pixels[(i+j*widthd)*4+1] = bright;
      noiseImg.pixels[(i+j*widthd)*4+2] = bright;
      noiseImg.pixels[(i+j*widthd)*4+3] = 255;
    }
  }
  noiseImg.updatePixels();
}
