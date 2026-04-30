let scaleFactor = 0.85;
let glowStrength = 6;
let stepSize = 6;
let gridSize = 90;
let baseBg;
let fft;
let uiPanel;
let uiTitle;
let uiHint;
let audioFileInput;
let audioPlayer;
let sourceReady = false;

function setup() {
    createCanvas(windowWidth, windowHeight);
    noSmooth();

    baseBg = color(30, 50, 120);
    fft = new p5.FFT(0.85, 256);

    uiPanel = createDiv();
    uiPanel.style("position", "absolute");
    uiPanel.style("top", "28px");
    uiPanel.style("left", "50%");
    uiPanel.style("transform", "translateX(-50%)");
    uiPanel.style("display", "flex");
    uiPanel.style("flex-direction", "column");
    uiPanel.style("align-items", "center");
    uiPanel.style("gap", "10px");
    uiPanel.style("padding", "16px 20px");
    uiPanel.style("background", "rgba(10, 14, 28, 0.55)");
    uiPanel.style("border", "1px solid rgba(255,255,255,0.35)");
    uiPanel.style("border-radius", "18px");
    uiPanel.style("box-shadow", "0 0 24px rgba(255,255,255,0.12)");
    uiPanel.style("backdrop-filter", "blur(10px)");

    uiTitle = createP("Osciloscopio Audioreactivo");
    uiTitle.parent(uiPanel);
    uiTitle.style("margin", "0");
    uiTitle.style("color", "white");
    uiTitle.style("font-family", "'Trebuchet MS', 'Arial', sans-serif");
    uiTitle.style("font-size", "20px");
    uiTitle.style("letter-spacing", "0.08em");
    uiTitle.style("text-transform", "uppercase");

    uiHint = createP("Selecciona un archivo de audio para animar la onda");
    uiHint.parent(uiPanel);
    uiHint.style("margin", "0");
    uiHint.style("color", "rgba(255,255,255,0.78)");
    uiHint.style("font-family", "'Trebuchet MS', 'Arial', sans-serif");
    uiHint.style("font-size", "13px");

    audioFileInput = createFileInput(handleAudioFile);
    audioFileInput.parent(uiPanel);
    audioFileInput.style("width", "320px");
    audioFileInput.style("color", "white");
    audioFileInput.style("font-family", "'Trebuchet MS', 'Arial', sans-serif");
    audioFileInput.style("font-size", "14px");
    audioFileInput.style("padding", "10px 14px");
    audioFileInput.style("border", "1px solid rgba(255,255,255,0.45)");
    audioFileInput.style("border-radius", "999px");
    audioFileInput.style("background", "rgba(255,255,255,0.08)");
}

function draw() {
    let wave = sourceReady ? fft.waveform() : [];
    let bass = sourceReady ? fft.getEnergy("bass") : 0;
    let mid = sourceReady ? fft.getEnergy("mid") : 0;
    let treble = sourceReady ? fft.getEnergy("treble") : 0;

    let bgR = red(baseBg) + bass * 0.5;
    let bgG = green(baseBg) + mid * 0.35;
    let bgB = blue(baseBg) + treble * 0.45;
    let waveGlow = map(treble, 0, 255, glowStrength, 38, true);
    let waveGreen = map(mid, 0, 255, 160, 255, true);
    let waveBlue = map(treble, 0, 255, 40, 180, true);

    background(
        constrain(bgR, 0, 255),
        constrain(bgG, 0, 255),
        constrain(bgB, 0, 255),
        70
    );

    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = color(255, 255, 255);
    stroke(255, 255, 255, 100);
    strokeWeight(2);

    for (let y = 0; y < height; y += gridSize) {
        line(0, y, width, y);
    }
    for (let x = 0; x < width; x += gridSize) {
        line(x, 0, x, height);
    }

    drawingContext.shadowBlur = waveGlow;
    drawingContext.shadowColor = color(0, waveGreen, waveBlue);

    push();
    translate(width * (1 - scaleFactor) * 0.5, height * (1 - scaleFactor) * 0.5);
    scale(scaleFactor);

    noStroke();
    fill(0, waveGreen, waveBlue);

    for (let i = 0; i < wave.length - 1; i += 1) {
        let x1 = snap(map(i, 0, wave.length - 1, width * 0.15, width * 0.85), stepSize);
        let x2 = snap(map(i + 1, 0, wave.length - 1, width * 0.15, width * 0.85), stepSize);

        let y1 = map(wave[i], -1, 1, height * 0.65, height * 0.35);
        let y2 = map(wave[i + 1], -1, 1, height * 0.65, height * 0.35);
        y1 = snap(y1, stepSize);
        y2 = snap(y2, stepSize);

        rect(x1, y1, stepSize, stepSize);

        let direction = y2 > y1 ? stepSize : -stepSize;
        for (let y = y1; y !== y2; y += direction) {
            rect(x2, y, stepSize, stepSize);
        }

        rect(x2, y2, stepSize, stepSize);
    }

    pop();

    if (!sourceReady) {
        noStroke();
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(30);
        text("Carga un archivo de audio para activar el osciloscopio", width / 2, height * 0.9);
    }

    drawingContext.shadowBlur = 0;
}

function handleAudioFile(file) {
    if (file.type !== "audio") {
        return;
    }

    userStartAudio();

    if (audioPlayer) {
        audioPlayer.stop();
        audioPlayer.remove();
    }

    audioPlayer = createAudio(file.data);
    audioPlayer.parent(uiPanel);
    audioPlayer.elt.controls = true;
    audioPlayer.style("width", "320px");
    audioPlayer.style("display", "block");
    audioPlayer.volume(1);
    audioPlayer.showControls();
    audioPlayer.play();

    fft.setInput(audioPlayer);
    sourceReady = true;
}

function mousePressed() {
    userStartAudio();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function snap(val, grid) {
    return floor(val / grid) * grid;
}
