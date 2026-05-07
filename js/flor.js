let scanData;
let bgImg;
let points = [];
let soundFile;
let fileInput;
let amp;
let audioLevel = 0;
let scanScale = 1;
let targetScanScale = 1;
let rotationY = 0;

function preload() {
  scanData = loadJSON('img/point-lite.json');
  bgImg = loadImage('img/cielo.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  amp = new p5.Amplitude();
  normalizePointCloud();
  fileInput = createFileInput(handleAudioFile);
  fileInput.position(12, 12);
  fileInput.style('z-index', '10');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  normalizePointCloud();
}

function draw() {
  background(5, 8, 18);
  audioLevel = amp ? lerp(audioLevel, amp.getLevel(), 0.18) : 0;
  targetScanScale = map(audioLevel, 0, 0.45, 1, 1.9, true);
  scanScale = lerp(scanScale, targetScanScale, 0.1);
  rotationY += 0.003 + audioLevel * 0.08;

  orbitControl();
  rotateX(map(mouseY, 0, height, -0.35, 0.35));
  rotateY(rotationY + map(mouseX, 0, width, -0.45, 0.45));
  scale(scanScale);
  drawPointCloud();
}

function drawPointCloud() {
  strokeWeight(map(audioLevel, 0, 0.45, 1.2, 4.2, true));
  for (let i = 0; i < points.length; i++) {
    let p = points[i];
    stroke(p.r, p.g, p.b);
    point(p.x, p.y, p.z);
  }
}

function normalizePointCloud() {
  let minP = scanData.meta.min;
  let maxP = scanData.meta.max;
  let cx = (minP[0] + maxP[0]) * 0.5;
  let cy = (minP[1] + maxP[1]) * 0.5;
  let cz = (minP[2] + maxP[2]) * 0.5;
  let largestSide = max(maxP[0] - minP[0], maxP[1] - minP[1], maxP[2] - minP[2]);
  let fitScale = min(width, height) * 0.8 / largestSide;

  points = [];
  for (let i = 0; i < scanData.points.length; i++) {
    let raw = scanData.points[i];
    let yColor = map(raw[1], minP[1], maxP[1], 70, 255, true);
    points.push({
      x: (raw[0] - cx) * fitScale,
      y: -(raw[1] - cy) * fitScale,
      z: (raw[2] - cz) * fitScale,
      r: map(raw[2], minP[2], maxP[2], 120, 255, true),
      g: yColor,
      b: map(raw[0], minP[0], maxP[0], 180, 255, true)
    });
  }
}

function handleAudioFile(file) {
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
