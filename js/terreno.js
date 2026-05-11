
let sizes = [];
let cols = 100; let rows = 100; let size = 14;
let xoff = 0; let yoff = 0; let inc = 0.1;
let zoff = 0;
let seaScroll = 0;
let soundFile;
let fileInput;
let amp;
let audioLevel = 0;
let viewX = 0;
let viewY = 0;
let sceneX = 0;
let sceneY = 0;
let sceneZoom = 1;
let targetZoom = 1;
let bgImg;
let startText;

function preload() {
  bgImg = loadImage('img/cielo.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  rectMode(CENTER);
  angleMode(DEGREES);
  amp = new p5.Amplitude();
  fileInput = createFileInput(handleFile);
  fileInput.position(10, 48);
  fileInput.style('z-index', '10');
  startText = createDiv('carga una canción en seleccionar archivo');
  startText.position(0, 0);
  startText.size(windowWidth, windowHeight);
  startText.style('position', 'fixed');
  startText.style('display', 'flex');
  startText.style('align-items', 'center');
  startText.style('justify-content', 'center');
  startText.style('text-align', 'center');
  startText.style('color', 'white');
  startText.style('font-family', 'Arial, sans-serif');
  startText.style('font-size', 'clamp(18px, 3.6vw, 34px)');
  startText.style('font-weight', '300');
  startText.style('text-shadow', '0 3px 10px rgba(0, 0, 0, 0.85)');
  startText.style('z-index', '20');
  startText.style('pointer-events', 'none');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  startText.size(windowWidth, windowHeight);
}

function draw() {
  drawBackgroundImage();
  audioLevel = amp ? lerp(audioLevel, amp.getLevel(), 0.50) : 0;
  seaScroll = (seaScroll + 1.35 + audioLevel * 42) % (rows * size);
  viewX = lerp(viewX, map(mouseX, 0, width, -18, 18), 0.05);
  viewY = lerp(viewY, map(mouseY, 0, height, -54, -36), 0.05);
  sceneX = lerp(sceneX, map(mouseX, 0, width, 90, -90), 0.045);
  sceneY = lerp(sceneY, map(mouseY, 0, height, 110, 185), 0.045);
  sceneZoom = lerp(sceneZoom, targetZoom, 0.08);
  
  translate(sceneX, sceneY, -260);
  scale(sceneZoom);
  rotateX(viewY);
  rotateY(viewX);
  
  xoff = 0;
  for (let i=0; i<cols; i++){
    sizes[i] = [];
    yoff = 0;
    for (let j=0; j<rows; j++){
      let zPos = ((j * size + seaScroll) % (rows * size)) - rows * size / 2;
      let waveNoise = noise(xoff, yoff + seaScroll * 0.02, zoff);
      let heightContrast = pow(waveNoise, 2.4);
      let baseHeight = map(heightContrast, 0, 1, 4, 210);
      let audioAmount = map(audioLevel, 0, 0.45, 0, 620, true);
      let audioResponse = map(pow(noise(i * 0.36, j * 0.22, zoff * 14), 2), 0, 1, 0.08, 2.8);
      let audioHeight = audioAmount * audioResponse;
      sizes[i][j] = baseHeight + audioHeight;
      yoff += inc;
      
      let r = map(waveNoise, 0, 1, 0, 20);
      let g = map(sizes[i][j], 4, 610, 35, 255, true);
      let b = map(noise(xoff, yoff + 30, zoff), 0, 1, 190, 255);
      
      fill(r, g, b);
      noStroke();
      push();
      translate(i*size - cols*size/2, -sizes[i][j]/2, zPos);
      // You can also put the second argument 100 with sizes[i][j] in the box() function instead of the translate function 
      box(size, sizes[i][j], size); 
      pop();
       
      
      // rect(size/2 + i*size, size/2 + j*size, sizes[i][j], sizes[i][j]);
    }
    xoff += inc;
    zoff += 0.0001;
  }

}

function mouseWheel(event) {
  targetZoom = constrain(targetZoom - event.delta * 0.001, 0.55, 1.85);
  return false;
}

function drawBackgroundImage() {
  push();
  resetMatrix();
  drawingContext.disable(drawingContext.DEPTH_TEST);
  imageMode(CENTER);
  noStroke();
  let imgRatio = bgImg.width / bgImg.height;
  let canvasRatio = width / height;
  let drawW = width;
  let drawH = height;

  if (canvasRatio > imgRatio) {
    drawH = width / imgRatio;
  } else {
    drawW = height * imgRatio;
  }

  image(bgImg, 0, 0, drawW, drawH);
  drawingContext.enable(drawingContext.DEPTH_TEST);
  drawingContext.clear(drawingContext.DEPTH_BUFFER_BIT);
  pop();
}

function handleFile(file) {
  if (file.type !== 'audio') {
    return;
  }

  if (soundFile) {
    soundFile.stop();
  }

  userStartAudio();
  soundFile = loadSound(file.data, function() {
    amp.setInput(soundFile);
    soundFile.loop();
    startText.hide();
  });
}
