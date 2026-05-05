let plyBytes;
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
  plyBytes = loadBytes('img/point.ply');
  bgImg = loadImage('img/cielo.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  amp = new p5.Amplitude();
  parsePlyPointCloud();
  fileInput = createFileInput(handleAudioFile);
  fileInput.position(12, 12);
  fileInput.style('z-index', '10');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  //drawBackgroundImage();
  background(5, 8, 18);
  audioLevel = amp ? lerp(audioLevel, amp.getLevel(), 0.18) : 0;
  targetScanScale = map(audioLevel, 0, 0.45, 1, 1.9, true);
  scanScale = lerp(scanScale, targetScanScale, 0.10);
  rotationY += 0.003 + audioLevel * 0.08;

  orbitControl();
  ambientLight(80);
  pointLight(120, 180, 255, 0, -300, 500);
  rotateX(map(mouseY, 0, height, -0.35, 0.35));
  rotateY(rotationY + map(mouseX, 0, width, -0.45, 0.45));
  scale(scanScale);
  drawPointCloud();
}

function drawBackgroundImage() {
  push();
  resetMatrix();
  imageMode(CENTER);
  let imgRatio = bgImg.width / bgImg.height;
  let canvasRatio = width / height;
  let drawWidth = width;
  let drawHeight = height;

  if (imgRatio > canvasRatio) {
    drawHeight = height;
    drawWidth = drawHeight * imgRatio;
  } else {
    drawWidth = width;
    drawHeight = drawWidth / imgRatio;
  }

  image(bgImg, 0, 0, drawWidth, drawHeight);
  pop();
}

function drawPointCloud() {
  strokeWeight(map(audioLevel, 0, 0.45, 1.1, 3.8, true));
  for (let i = 0; i < points.length; i++) {
    let p = points[i];
    stroke(min(p.r * 1.25, 255), min(p.g * 1.25, 255), min(p.b * 1.25, 255));
    point(p.x, p.y, p.z);
  }
}

function parsePlyPointCloud() {
  let bytes = plyBytes.bytes;
  let headerEnd = findHeaderEnd(bytes);
  let header = '';
  for (let i = 0; i < headerEnd; i++) {
    header += String.fromCharCode(bytes[i]);
  }

  let vertexCount = int(header.match(/element vertex (\d+)/)[1]);
  let stride = 27;
  let maxPoints = 65000;
  let step = max(1, floor(vertexCount / maxPoints));
  let data = new DataView(Uint8Array.from(bytes).buffer);
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  for (let i = 0; i < vertexCount; i += step) {
    let offset = headerEnd + i * stride;
    let p = {
      x: data.getFloat64(offset, true),
      y: data.getFloat64(offset + 8, true),
      z: data.getFloat64(offset + 16, true),
      r: data.getUint8(offset + 24),
      g: data.getUint8(offset + 25),
      b: data.getUint8(offset + 26)
    };
    points.push(p);
    minX = min(minX, p.x); minY = min(minY, p.y); minZ = min(minZ, p.z);
    maxX = max(maxX, p.x); maxY = max(maxY, p.y); maxZ = max(maxZ, p.z);
  }

  normalizePoints(minX, minY, minZ, maxX, maxY, maxZ);
}

function normalizePoints(minX, minY, minZ, maxX, maxY, maxZ) {
  let cx = (minX + maxX) * 0.5;
  let cy = (minY + maxY) * 0.5;
  let cz = (minZ + maxZ) * 0.5;
  let largestSide = max(maxX - minX, maxY - minY, maxZ - minZ);
  let fitScale = min(width, height) * 0.75 / largestSide;

  for (let i = 0; i < points.length; i++) {
    points[i].x = (points[i].x - cx) * fitScale;
    points[i].y = -(points[i].y - cy) * fitScale;
    points[i].z = (points[i].z - cz) * fitScale;
  }
}

function findHeaderEnd(bytes) {
  let marker = 'end_header';
  for (let i = 0; i < bytes.length - marker.length; i++) {
    let match = true;
    for (let j = 0; j < marker.length; j++) {
      if (bytes[i + j] !== marker.charCodeAt(j)) {
        match = false;
        break;
      }
    }
    if (match) {
      return i + marker.length + 1;
    }
  }
  return 0;
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
