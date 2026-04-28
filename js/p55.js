let x = 0;
let y = 0;
let size = 42;
let stroke_weight = 1;
let easing = 0.075;


let osc;
let sonidoActivo = false;

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60);

    osc = new p5.Oscillator('sine');
    osc.start();
    osc.amp(0);
}

function draw() {
    background(255, 182, 193, 40); 
    x += (mouseX - x) * easing;
    y += (mouseY - y) * easing;

    strokeWeight(stroke_weight);

    let r = map(mouseX, 0, width, 100, 255);
    let g = map(mouseY, 0, height, 100, 255);
    let b = map(mouseX + mouseY, 0, width + height, 200, 100);

    fill(r, g, b, 180);
    stroke(200, 50, 150);
    ellipse(x, y, size, size);

    let freq;

    if (mouseX < width / 3) {
        freq = 200; // zona izquierda (grave)
    } else if (mouseX < 2 * width / 3) {
        freq = 400; // centro
    } else {
        freq = 800; // derecha (agudo)
    }

    osc.freq(freq);

    // volumen con altura solo si sonidoActivo
    if (sonidoActivo) {
        let vol = map(mouseY, height, 0, 0, 0.5);
        osc.amp(vol, 0.1);
    } else {
        osc.amp(0, 0.1);
    }
}

function mousePressed() {
    userStartAudio();
    sonidoActivo = !sonidoActivo;
    if (!sonidoActivo) {
        osc.amp(0, 0.1);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}