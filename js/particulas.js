//TODO: with simple circle blur straight forward.

var particles = [];
var noiseImg;
var bgColor;
var targetBgColor;
var noiseX = 0;
var noiseY = 0;
var targetNoiseX = 0;
var targetNoiseY = 0;
var n = 3000//number of particle
var noiseScale = 100;//noise scale;
var repelRadius = 130;
var repelStrength = 8;
var particleColor;
var targetParticleColor;
var particleShape = 0;
var targetParticleShape = 0;
var particleSize = 4;
var targetParticleSize = 4;

function setup() {
  
  createCanvas(windowWidth, windowHeight);
  bgColor = color(255);
  targetBgColor = bgColor;
  particleColor = color(255);
  targetParticleColor = particleColor;
  background(bgColor);
  noiseDetail(30, 0);
  console.log(pixelDensity());
  //generate noise image
  genNoiseImg();
  drawNoiseLayer(255);
  
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
  background(bgColor);
  genNoiseImg();
  drawNoiseLayer(255);
  resetParticles();
}

function mouseMoved() {
  targetBgColor = color(random(255), random(255), random(255));
  targetParticleColor = color(random(255), random(255), random(255));
  targetParticleShape = floor(random(3));
  targetParticleSize = random(3, 9);
  targetNoiseX = map(mouseX, 0, width, -width * 0.25, width * 0.25);
  targetNoiseY = map(mouseY, 0, height, -height * 0.25, height * 0.25);
  drawNoiseLayer(80);
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
  updateBackgroundColor();
  updateParticleStyle();
  noiseX = lerp(noiseX, targetNoiseX, 0.08);
  noiseY = lerp(noiseY, targetNoiseY, 0.08);
  drawNoiseLayer(4);//fill with transparent moving noise image
  //fill(0, 4);
  //rect(0, 0, width, height);
  
  noStroke();
  fill(particleColor);
  
  
  for(var i=0; i<particles.length; i++){
    var p = particles[i];//pick a particle
    p.pos.add(curl(p.pos.x/noiseScale, p.pos.y/noiseScale));
    repelFromMouse(p);
    drawParticle(p.pos.x, p.pos.y);
  }
}

function updateParticleStyle() {
  particleColor = lerpColor(particleColor, targetParticleColor, 0.05);
  particleSize = lerp(particleSize, targetParticleSize, 0.05);

  if (frameCount % 12 == 0) {
    particleShape = targetParticleShape;
  }
}

function drawParticle(x, y) {
  if (particleShape == 0) {
    circle(x, y, particleSize);
  } else if (particleShape == 1) {
    rectMode(CENTER);
    square(x, y, particleSize);
  } else {
    triangle(
      x, y - particleSize * 0.6,
      x - particleSize * 0.55, y + particleSize * 0.45,
      x + particleSize * 0.55, y + particleSize * 0.45
    );
  }
}

function repelFromMouse(particle) {
  var mousePos = createVector(mouseX, mouseY);
  var away = p5.Vector.sub(particle.pos, mousePos);
  var distance = away.mag();

  if (distance > 0 && distance < repelRadius) {
    var force = map(distance, 0, repelRadius, repelStrength, 0);
    away.normalize();
    away.mult(force);
    particle.pos.add(away);
  }
}

function updateBackgroundColor() {
  var colorDistance =
    abs(red(bgColor) - red(targetBgColor)) +
    abs(green(bgColor) - green(targetBgColor)) +
    abs(blue(bgColor) - blue(targetBgColor));

  if (colorDistance < 2) {
    return;
  }

  bgColor = lerpColor(bgColor, targetBgColor, 0.04);
  noStroke();
  fill(red(bgColor), green(bgColor), blue(bgColor), 5);
  rect(0, 0, width, height);
}

function drawNoiseLayer(alphaValue) {
  var marginX = (noiseImg.width - width) * 0.5;
  var marginY = (noiseImg.height - height) * 0.5;
  var x = noiseX - marginX;
  var y = noiseY - marginY;

  tint(255, alphaValue);
  image(noiseImg, x, y);
}

function genNoiseImg(){
  noiseImg = createGraphics(width * 1.5, height * 1.5);
  noiseImg.loadPixels();
  var widthd = noiseImg.width*pixelDensity();
  var heightd = noiseImg.height*pixelDensity();
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
