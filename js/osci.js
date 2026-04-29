let wave = [];
let scaleFactor = 9;
let lineThickness = 4;
let glowStrength = 80;
let stepSize = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);

  // 🎛️ control de tamaño con mouse
  scaleFactor = map(mouseX, 0, width, 0.6, 2.5);

  // generar señal
  let y = sin(frameCount * 0.1);
  wave.push(y);

  // limitar tamaño
  if (wave.length > width) {
    wave.shift();
  }

  // 🔳 grid
  stroke(0, 90, 0, 90);
  strokeWeight(3);
  for (let y = 0; y < height; y += 24) {
    line(0, y, width, y);
  }
  for (let x = 0; x < width; x += 24) {
    line(x, 0, x, height);
  }

  // ✨ glow
  drawingContext.shadowBlur = glowStrength;
  drawingContext.shadowColor = color(0, 255, 0);

  // 🎨 dibujo del osciloscopio ESCALADO
  push();
  translate(width / 2, height / 2);
  scale(scaleFactor);
  translate(-width / 2, -height / 2);

  stroke(0, 255, 0);
  strokeWeight(lineThickness);
  noFill();

  for (let i = 0; i < wave.length - stepSize; i += stepSize) {
    let x1 = i;
    let y1 = map(wave[i], -1, 1, height * 0.7, height * 0.3);
    let x2 = i + stepSize;
    let y2 = map(wave[i + stepSize], -1, 1, height * 0.7, height * 0.3);

    line(x1, y1, x2, y1);
    line(x2, y1, x2, y2);
    square(x1 - lineThickness / 2, y1 - lineThickness / 2, lineThickness);
  }


  pop();

  drawingContext.shadowBlur = 0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
