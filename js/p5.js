let angle = 0;

let bgR, bgG, bgB;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);

  bgR = random(255);
  bgG = random(255);
  bgB = random(255);
}

function draw() {

  // fondo cambia cuando mueves el mouse
  if (movedX !== 0 || movedY !== 0) {
    bgR = random(255);
    bgG = random(255);
    bgB = random(255);
  }

background(bgR, bgG, bgB, 25);

  let r = map(mouseX, 0, width, 0, 255);
  let g = map(mouseY, 0, height, 0, 255);
  let b = map(mouseX + mouseY, 0, width + height, 0, 255);

  // ⭐ GLOW
  drawingContext.shadowBlur = 60;
  drawingContext.shadowColor = color(255,255,255);

  fill(r, g, b);
  noStroke();

  push();
  translate(mouseX, mouseY);
  rotate(angle);

  // estrella grande
  star(0, 0, 60, 140, 5);

  pop();

  // velocidad de rotación
  angle += 0.05;
}

// función estrella
function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;

  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}