let scaleFactor = 0.90;
let waveGlowMin = 10;
let waveGlowMax = 36;
let gridGlowMin = 0;
let gridGlowMax = 30;
let stepSize = 4;
let gridSize = 90;
let waveTop = 1;
let waveBottom = 0.10;
let baseBg;
let fft;
let uiPanel;
let uiTitle;
let uiHint;
let audioFileInput;
let bgImageInput;
let audioPlayer;
let sourceReady = false;
let gridGlowCurrent = 0;
let lastSoundEnergy = 0;
let lastGridEnergy = 0;
let waveColorCurrent;
let waveColorTarget;
let gridColorCurrent;
let gridColorTarget;
let bgImage = null;
let bgVideo = null;
let bgScaleCurrent = 1;

function setup() {
    createCanvas(windowWidth, windowHeight);
    noSmooth();
    textFont("Trebuchet MS");

    baseBg = color(255, 255, 120);
    fft = new p5.FFT(0.85, 256);
    waveColorCurrent = color(0, 255, 120);
    waveColorTarget = color(0, 255, 120);
    gridColorCurrent = color(255, 255, 255);
    gridColorTarget = color(255, 255, 255);

    uiPanel = createDiv();
    uiPanel.style("position", "absolute");
    uiPanel.style("top", "33px");
    uiPanel.style("left", "50%");
    uiPanel.style("transform", "translateX(-50%)");
    uiPanel.style("display", "flex");
    uiPanel.style("flex-direction", "column");
    uiPanel.style("align-items", "center");
    uiPanel.style("gap", "10px");
    uiPanel.style("padding", "30px 30px");
    uiPanel.style("background", "rgba(98, 255, 0, 0.55)");
    uiPanel.style("border", "1px solid rgba(255, 255, 255, 0.04)");
    uiPanel.style("border-radius", "18px");
    uiPanel.style("box-shadow", "0 0 24px rgb(98, 255, 0)");
    uiPanel.style("backdrop-filter", "blur(10px)");

    uiTitle = createP("oscil0scopio aud10reactivo");
    uiTitle.parent(uiPanel);
    uiTitle.style("margin", "0");
    uiTitle.style("color", "white");
    uiTitle.style("font-family", "'Trebuchet MS', 'Arial', sans-serif");
    uiTitle.style("font-size", "20px");
    uiTitle.style("letter-spacing", "0.08em");
    uiTitle.style("text-transform", "uppercase");

    uiHint = createP("");
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
    audioFileInput.style("border", "1px solid rgb(255, 255, 255)");
    audioFileInput.style("border-radius", "999px");
    audioFileInput.style("background", "rgba(255,255,255,0.08)");

    bgImageInput = createFileInput(handleBackgroundMedia);
    bgImageInput.parent(uiPanel);
    bgImageInput.style("width", "320px");
    bgImageInput.style("color", "white");
    bgImageInput.style("font-family", "'Trebuchet MS', 'Arial', sans-serif");
    bgImageInput.style("font-size", "14px");
    bgImageInput.style("padding", "10px 14px");
    bgImageInput.style("border", "1px solid rgb(255, 255, 255)");
    bgImageInput.style("border-radius", "999px");
    bgImageInput.style("background", "rgba(255,255,255,0.08)");
}

function draw() {
    if (sourceReady) {
        fft.analyze();
    }

    let wave = sourceReady ? fft.waveform() : [];
    let bass = sourceReady ? fft.getEnergy("bass") : 0;
    let mid = sourceReady ? fft.getEnergy("mid") : 0;
    let treble = sourceReady ? fft.getEnergy("treble") : 0;

    let waveGlow = map(treble, 0, 255, waveGlowMin, waveGlowMax, true);
    // let gridGlowTarget = map(bass, 0, 255, gridGlowMin, gridGlowMax, true);
    // let gridAlpha = map(mid, 0, 255, 40, 255, true);
    // let gridWeight = map(bass, 0, 255, 1, 4, true);
    let soundEnergy = bass * 0.45 + mid * 0.35 + treble * 0.2;
    // let gridEnergy = bass * 0.5 + treble * 0.5;
    // gridGlowCurrent = lerp(gridGlowCurrent, gridGlowTarget, 0.28);

    if (sourceReady && abs(soundEnergy - lastSoundEnergy) > 22) {
        waveColorTarget = color(random(0, 255), random(0, 255), random(0, 255));
    }

    // if (sourceReady && abs(gridEnergy - lastGridEnergy) > 18) {
    //     gridColorTarget = color(random(120, 255), random(120, 255), random(120, 255));
    // }

    lastSoundEnergy = soundEnergy;
    // lastGridEnergy = gridEnergy;
    let currentWaveR = lerp(red(waveColorCurrent), red(waveColorTarget), 0.12);
    let currentWaveG = lerp(green(waveColorCurrent), green(waveColorTarget), 0.12);
    let currentWaveB = lerp(blue(waveColorCurrent), blue(waveColorTarget), 0.12);
    waveColorCurrent = color(currentWaveR, currentWaveG, currentWaveB);
    let bgScaleTarget = map(soundEnergy, 0, 255, 0.8, 2, true);
    bgScaleCurrent = lerp(bgScaleCurrent, bgScaleTarget, 0.9);
    // let currentGridR = lerp(red(gridColorCurrent), red(gridColorTarget), 0.1);
    // let currentGridG = lerp(green(gridColorCurrent), green(gridColorTarget), 0.1);
    // let currentGridB = lerp(blue(gridColorCurrent), blue(gridColorTarget), 0.1);
    // gridColorCurrent = color(currentGridR, currentGridG, currentGridB);

    if (bgVideo) {
        drawBackgroundCover(bgVideo, bgScaleCurrent);
    } else if (bgImage) {
        drawBackgroundCover(bgImage, bgScaleCurrent);
    } else {
        background(baseBg);
    }

    // drawingContext.shadowBlur = gridGlowCurrent;
    // drawingContext.shadowColor = gridColorCurrent;
    // stroke(red(gridColorCurrent), green(gridColorCurrent), blue(gridColorCurrent), gridAlpha);
    // strokeWeight(gridWeight);

    // for (let y = 0; y < height; y += gridSize) {
    //     line(0, y, width, y);
    // }
    // for (let x = 0; x < width; x += gridSize) {
    //     line(x, 0, x, height);
    // }

    drawingContext.shadowBlur = waveGlow;
    drawingContext.shadowColor = waveColorCurrent;

    push();
    translate(width * (1 - scaleFactor) * 0.5, height * (1 - scaleFactor) * 0.5);
    scale(scaleFactor);

    noStroke();
    fill(waveColorCurrent);

    for (let i = 0; i < wave.length - 1; i += 1) {
        let x1 = snap(map(i, 0, wave.length - 1, width * 0.12, width * 0.88), stepSize);
        let x2 = snap(map(i + 1, 0, wave.length - 1, width * 0.12, width * 0.88), stepSize);

        let y1 = map(wave[i], -1, 1, height * waveTop, height * waveBottom);
        let y2 = map(wave[i + 1], -1, 1, height * waveTop, height * waveBottom);
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
        textSize(50);
        text(":3", width / 2, height/2 );
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
    audioPlayer.style("width", "420px");
    audioPlayer.style("display", "block");
    audioPlayer.volume(1);
    audioPlayer.play();

    fft.setInput(audioPlayer);
    sourceReady = true;
}

function handleBackgroundMedia(file) {
    if (bgVideo) {
        bgVideo.stop();
        bgVideo.remove();
        bgVideo = null;
    }

    bgImage = null;

    if (file.type === "image") {
        loadImage(file.data, (img) => {
            bgImage = img;
        });
        return;
    }

    if (file.type === "video") {
        bgVideo = createVideo([file.data], () => {
            bgVideo.volume(0);
            bgVideo.loop();
            bgVideo.hide();
        });
    }
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

function drawBackgroundCover(img, scaleAmount) {
    let imgRatio = img.width / img.height;
    let canvasRatio = width / height;
    let drawWidth;
    let drawHeight;

    if (imgRatio > canvasRatio) {
        drawHeight = height * scaleAmount;
        drawWidth = drawHeight * imgRatio;
    } else {
        drawWidth = width * scaleAmount;
        drawHeight = drawWidth / imgRatio;
    }

    let x = (width - drawWidth) * 0.5;
    let y = (height - drawHeight) * 0.5;
    image(img, x, y, drawWidth, drawHeight);
}
