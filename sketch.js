let world;

function setup() {
  createCanvas(800, 800);
  // World starts with 20 creatures
  // and 20 pieces of food
  world = new World(20);
}

function draw() {
  background(175);
  world.run();
}

// We can add a creature manually if we so desire
function mousePressed() {
  world.born(mouseX, mouseY);
}

function mouseDragged() {
  world.born(mouseX, mouseY);
}