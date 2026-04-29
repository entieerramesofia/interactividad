let wave = [];
let scaleFactor = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);

  // 🎛️ control de tamaño con mouse
  scaleFactor = map(mouseX, 0, width, 0.5, 2.5);

  // generar señal
  let y = sin(frameCount * 0.1);
  wave.push(y);

  // limitar tamaño
  if (wave.length > width) {
    wave.shift();
  }

  // 🔳 grid
  stroke(0, 50);
  for (let y = 0; y < height; y += 4) {
    line(0, y, width, y);
  }

  // ✨ glow
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = color(0, 255, 0);

  // 🎨 dibujo del osciloscopio ESCALADO
  push();
  translate(width / 2, height / 2);
  scale(scaleFactor);
  translate(-width / 2, -height / 2);

  noFill();
  stroke(0, 255, 0);
  strokeWeight(2);

  beginShape();
  for (let i = 0; i < wave.length; i++) {
    let x = i;
    let y = map(wave[i], -1, 1, height, 0);
    vertex(x, y);
  }
  endShape();

  pop();
}