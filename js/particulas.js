var particles = [];
var noiseImg, bgColor, targetBgColor, particleColor, targetParticleColor;
var noiseX = 0, noiseY = 0, targetNoiseX = 0, targetNoiseY = 0;
var n = 4000, noiseScale = 10, repelRadius = 100, repelStrength = 8;
var particleShape = 0, targetParticleShape = 0, particleSize = 2, targetParticleSize = 4;

function setup() {
  createCanvas(windowWidth, windowHeight);
  bgColor = color(255);
  targetBgColor = bgColor;
  particleColor = color(255);
  targetParticleColor = particleColor;
  background(bgColor);
  noiseDetail(30, 0);
  genNoiseImg();
  drawNoiseLayer(255);
  resetParticles();
}

function resetParticles() {
  particles = [];
  for (var i = 0; i < n; i++) {
    particles.push({pos: createVector(random(width), random(height))});
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
  targetParticleSize = random(7, 9);
  targetNoiseX = map(mouseX, 0, width, -width * 0.25, width * 0.25);
  targetNoiseY = map(mouseY, 0, height, -height * 0.25, height * 0.25);
  drawNoiseLayer(80);
}

function curl(x, y) {
  var epsilon = 0.001;
  var cx = (noise(x + epsilon, y) - noise(x - epsilon, y)) / (2 * epsilon);
  var cy = (noise(x, y + epsilon) - noise(x, y - epsilon)) / (2 * epsilon);
  return createVector(cy, -cx);
}

function draw() {
  updateBackgroundColor();
  updateParticleStyle();
  noiseX = lerp(noiseX, targetNoiseX, 0.08);
  noiseY = lerp(noiseY, targetNoiseY, 0.08);
  drawNoiseLayer(4);
  noStroke();
  fill(particleColor);
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];
    p.pos.add(curl(p.pos.x / noiseScale, p.pos.y / noiseScale));
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
    return;
  }
    rectMode(CENTER);


    
  
}





function repelFromMouse(particle) {
  var away = p5.Vector.sub(particle.pos, createVector(mouseX, mouseY));
  var distance = away.mag();
  if (distance > 0 && distance < repelRadius) {
    away.normalize();
    away.mult(map(distance, 0, repelRadius, repelStrength, 0));
    particle.pos.add(away);
  }
}

function updateBackgroundColor() {
  var colorDistance = abs(red(bgColor) - red(targetBgColor)) + abs(green(bgColor) - green(targetBgColor)) + abs(blue(bgColor) - blue(targetBgColor));
  if (colorDistance < 2) {
    return;
  }
  bgColor = lerpColor(bgColor, targetBgColor, 0.04);
  noStroke();
  fill(red(bgColor), green(bgColor), blue(bgColor), 5);
  rectMode(CORNER);
  rect(0, 0, width, height);
}

function drawNoiseLayer(alphaValue) {
  var x = noiseX - (noiseImg.width - width) * 0.3;
  var y = noiseY - (noiseImg.height - height) * 0.3;
  tint(255, alphaValue);
  image(noiseImg, x, y);
}

function genNoiseImg() {
  noiseImg = createGraphics(width * 1.5, height * 1.5);
  noiseImg.loadPixels();
  var density = pixelDensity();
  var widthd = noiseImg.width * density;
  var heightd = noiseImg.height * density;
  for (var i = 0; i < widthd; i++) {
    for (var j = 0; j < heightd; j++) {
      var x = i / density;
      var y = j / density;
      var bright = pow(noise(x / noiseScale, y / noiseScale) - 0.3, 1 / 2.0) * 400;
      noiseImg.pixels[(i + j * widthd) * 6] = bright;
      noiseImg.pixels[(i + j * widthd) * 4 + 1] = bright;
      noiseImg.pixels[(i + j * widthd) * 4 + 2] = bright;
      noiseImg.pixels[(i + j * widthd) * 4 + 3] = 255;
    }
  }
  noiseImg.updatePixels();
}
