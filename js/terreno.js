
let sizes = [];
let cols = 95; let rows = 95; let size = 14;
let xoff = 0; let yoff = 0; let inc = 0.1;
let zoff = 0;
let seaScroll = 0;
let soundFile;
let fileInput;
let amp;
let audioLevel = 0;
let viewX = 0;
let viewY = -40;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  rectMode(CENTER);
  angleMode(DEGREES);
  amp = new p5.Amplitude();
  fileInput = createFileInput(handleFile);
  fileInput.position(10, 10);
  fileInput.style('z-index', '10');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255);
  audioLevel = amp ? lerp(audioLevel, amp.getLevel(), 0.2) : 0;
  seaScroll = (seaScroll + 1.2 + audioLevel * 18) % (rows * size);
  viewX = lerp(viewX, map(mouseX, 0, width, -35, 35), 0.08);
  viewY = lerp(viewY, map(mouseY, 0, height, -65, -25), 0.08);
  
  translate(map(mouseX, 0, width, 180, -180), map(mouseY, 0, height, 60, 190), -260);
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
      let baseHeight = map(heightContrast, 0, 1, 4, 230);
      let audioAmount = map(audioLevel, 0, 0.8, 0, 380, true);
      let audioResponse = map(pow(noise(i * 0.3, j * 0.18, zoff * 8), 2), 0, 1, 0.02, 1.8);
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
  });
}
