let size = 120;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
}

function draw() {
  background(200, 55, 0, 50);

  // Mapear posición del mouse a colores
  let r = map(mouseX, 0, width, 0, 255);
  let g = map(mouseY, 0, height, 0, 255);
  let b = map(mouseX + mouseY, 0, width + height, 0, 255);

  fill(r, g, b);
  noStroke();

  rect(mouseX, mouseY, size, size);
}