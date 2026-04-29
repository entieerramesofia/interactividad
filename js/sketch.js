let angle = 0;

let bgR, bgG, bgB;

// arreglo de estrellas
let stars = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);

  bgR = random(255);
  bgG = random(255);
  bgB = random(255);

  // crear varias estrellas
  for (let i = 0; i < 6; i++) {
    stars.push({
      orbitRadius: random(50, 200),
      speed: random(0.01, 0.05),
      sizeOffset: random(0.5, 1.5),
      angle: random(TWO_PI)
    });
  }
}

function draw() {

  // fondo dinámico
  if (movedX !== 0 || movedY !== 0) {
    bgR = random(255);
    bgG = random(255);
    bgB = random(255);
  }

  background(bgR, bgG, bgB, 40);

  let r = map(mouseX, 0, width, 0, 255);
  let g = map(mouseY, 0, height, 0, 255);
  let b = map(mouseX + mouseY, 0, width + height, 0, 255);

  // recorrer estrellas
  for (let s of stars) {

    // actualizar ángulo de órbita
    s.angle += s.speed;

    // posición orbital
    let x = mouseX + cos(s.angle) * s.orbitRadius;
    let y = mouseY + sin(s.angle) * s.orbitRadius;

    // glow
    drawingContext.shadowBlur = 50;
    drawingContext.shadowColor = color(r, g, b);

    fill(r, g, b);
    noStroke();

    push();
    translate(x, y);
    rotate(frameCount * 0.05);

    // ⭐ forma cambiante
    let radius1 = (40 + sin(frameCount * 0.1 + s.angle) * 20) * s.sizeOffset;
    let radius2 = (90 + sin(frameCount * 0.15 + s.angle) * 30) * s.sizeOffset;

    let points = int(map(sin(frameCount * 0.05 + s.angle), -1, 1, 4, 9));

    star(0, 0, radius1, radius2, points);

    pop();
  }
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