//Fonctionne sur p5.js  ;)

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  noFill();
  frameRate(30);

  layers = floor(random(2, 5));
  petalsPerLayer = floor(random(6, 12));
  maxStemPoints = floor(random(8, 15));  
  petalGrowthRate = 50; 
}

let petals = [];
let connections = [];
let stemPoints = [];
let lifeProgress = 0;
let lifeSpan = 600;
let state = 'growing';
let layers;
let petalsPerLayer;
let petalGrowthRate;
let petalCount = 0; 

function draw() {
  background(255, 50);
  drawConnections();
  drawPetals();
  drawStem();

  if (state === 'growing') {
    growFlower();
  } else if (state === 'dying') {
    fadeOutFlower();
  }

  lifeProgress++;

  if (lifeProgress > lifeSpan) {
    if (state === 'growing') {
      state = 'dying';
      lifeProgress = 0;
    } else if (state === 'dying') {
      resetFlower();
    }
  }
}

function growFlower() {

  if (stemPoints.length < maxStemPoints) {
    if (frameCount % 20 === 0) { 
      let startX = width / 2;
      let startY = height / 2 + 50;
      let nextPoint = { 
        x: startX + random(-15, 15),
        y: startY + (stemPoints.length * random(20, 30)), 
        alpha: 255
      };
      stemPoints.push(nextPoint);
    }
  }


  if (stemPoints.length === maxStemPoints && petalCount < layers * petalsPerLayer) {
    if (frameCount % petalGrowthRate === 0) { // Lenteur d'apparition des pétales
      let layer = floor(petalCount / petalsPerLayer);
      let angle = (TWO_PI / petalsPerLayer) * (petalCount % petalsPerLayer);
      let radius = 50 + layer * random(30, 70);
      let x = width / 2 + cos(angle + random(-0.2, 0.2)) * radius;
      let y = height / 2 + sin(angle + random(-0.2, 0.2)) * radius;
      petals.push({ x, y, alpha: 255 });
      connectPetals();
      petalCount++;
    }
  }
}

function fadeOutFlower() {
  // Fade out the petals
  for (let p of petals) {
    p.alpha -= 2;
    if (p.alpha <= 0) p.alpha = 0;
  }

  // Fade out the connections
  for (let c of connections) {
    c.alpha -= 2;
    if (c.alpha <= 0) c.alpha = 0;
  }

  // Fade out the stem points
  for (let point of stemPoints) {
    point.alpha -= 2;
    if (point.alpha <= 0) point.alpha = 0;
  }
}

function connectPetals() {
  if (petals.length > 1) {
    let last = petals[petals.length - 1];
    let closest = petals.reduce((closest, p) => {
      let d = dist(last.x, last.y, p.x, p.y);
      return d < closest.dist && d > 0 ? { dist: d, point: p } : closest;
    }, { dist: Infinity, point: null });

    if (closest.point && random() > 0.3) {
      connections.push({ start: last, end: closest.point, alpha: 255 });
    }
  }
}

function drawPetals() {
  for (let p of petals) {
    stroke(random(150, 255), 0, random(100, 200), p.alpha);
    strokeWeight(random(6, 10));
    point(p.x, p.y);
  }
}

function drawConnections() {
  for (let c of connections) {
    stroke(random(150, 255), 0, random(100, 200), c.alpha);
    strokeWeight(random(1, 3));
    line(c.start.x, c.start.y, c.end.x, c.end.y);
  }
}

function drawStem() {

  for (let p of stemPoints) {
    stroke(random(150, 255), 0, random(100, 200), p.alpha);
    strokeWeight(random(6, 10));
    point(p.x, p.y);
  }

  // Dessiner les connexions de la tige
  for (let i = 0; i < stemPoints.length - 1; i++) {
    let p1 = stemPoints[i];
    let p2 = stemPoints[i + 1];
    stroke(random(150, 255), 0, random(100, 200), p1.alpha); 
    strokeWeight(random(1, 3));
    line(p1.x, p1.y, p2.x, p2.y);
  }
}

function resetFlower() {
  petals = [];
  connections = [];
  stemPoints = [];
  petalCount = 0;
  lifeProgress = 0;
  state = 'growing';
  layers = floor(random(2, 5));
  petalsPerLayer = floor(random(6, 12));
  maxStemPoints = floor(random(8, 15));
  petalGrowthRate = floor(random(50, 80)); 
}
