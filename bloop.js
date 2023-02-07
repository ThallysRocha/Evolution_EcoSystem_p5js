const moduloMin = 1
function modulo(x,y){
  return sqrt((x*x)+(y*y))
}
class Bloop {
  constructor(l, dna_) {
    this.position = l.copy(); // Location
    this.health = 200; // Life timer
    this.reproduceDelay = 200;
    this.xoff = random(1000); // For perlin noise
    this.yoff = random(1000);
    this.dna = dna_; // DNA
    // DNA will determine size and maxspeed
    // The bigger the bloop, the slower it is
    
    this.maxspeed = map(this.dna.genes[0], 0, 1, 10, 2);
    this.r = map(this.dna.genes[0], 0, 1, 10, 50);
    this.visao = map(this.dna.genes[1],0,1,this.r,100);
    
    this.red = this.dna.genes[2]*255
    this.green = this.dna.genes[3]*255
    this.blue = this.dna.genes[4]*255
    
    this.maxForce = map(this.maxspeed, 0, 15, 0.1, 2);
    this.velocity = createVector(0, 0);
    this.acc = createVector(0, 0);   
    this.visto = false;
    this.sexualmenteAtivo = true;
  }
  
  run() {
    this.update();  
    if(this.reproduceDelay <= 0){
      this.sexualmenteAtivo = true;
      this.reproduceDelay = 0
    }
    else{
      this.sexualmenteAtivo = false;
    }
   // this.borders();
    this.display();
  }
  
  applyForce(force) {
    this.acc.add(force);
  }
  
  seek(target) {
    let force = p5.Vector.sub(target, this.position);
    force.setMag(this.maxspeed);
    force.sub(this.velocity);
    force.limit(this.maxForce);
    this.applyForce(force);
  }
  
  // A bloop can find food and eat it
  eat(f) {
    let food = f.getFood();
    // Are we touching any food objects?
    for (let i = food.length - 1; i >= 0; i--) {      
      let foodLocation = food[i];      
      let d = p5.Vector.dist(this.position, foodLocation);
      if(d < this.visao/2){
         this.visto = true
         this.seek(foodLocation)
         if (d < this.r / 2||d < 5) {
          this.health += 100;
          food.splice(i, 1);
          this.visto = false
         }
      }      
    }
  }
  

  // Method to update position
  update() {
    // Simple movement based on perlin noise
    if(!this.visto){
      if(this.velocity.x==0 &&this.velocity.y==0){
         let vx = map(noise(this.xoff), 0, 1, -this.maxspeed, this.maxspeed);
         let vy = map(noise(this.yoff), 0, 1, -this.maxspeed, this.maxspeed);
         this.velocity = createVector(vx, vy);
         this.xoff += 0.01;
         this.yoff += 0.01;
         }
      
      this.position.add(this.velocity);
      
    if(this.position.x < 0){
      
    this.velocity = createVector(Math.random(0.5,1)*this.maxspeed,this.velocity.y)
    while(modulo(this.velocity.x,this.velocity.y) <= moduloMin){
      this.velocity = createVector(Math.random(0.5,1)*this.maxspeed,this.velocity.y)
    }

  }
    if(this.position.y < 0){
    this.velocity = createVector(this.velocity.x,Math.random(0.5,1)*this.maxspeed)
    while(modulo(this.velocity.x,this.velocity.y) <= moduloMin){
      this.velocity = createVector(this.velocity.x,Math.random(0.5,1)*this.maxspeed)
    }

  }
    if(this.position.x > width){
    this.velocity = createVector(-Math.random(0.5,1)*this.maxspeed,this.velocity.y)
    while(modulo(this.velocity.x,this.velocity.y) <= moduloMin){
      this.velocity = createVector(-Math.random(0.5,1)*this.maxspeed,this.velocity.y)
    }
    
  }
    if(this.position.y > height){
    this.velocity = createVector(this.velocity.x,-Math.random(0.5,1)*this.maxspeed)
    while(modulo(this.velocity.x,this.velocity.y) <= moduloMin){
      this.velocity = createVector(this.velocity.x,-Math.random(0.5,1)*this.maxspeed)
    }
  }
      
    }
    else{
    this.velocity.add(this.acc);
    this.velocity.limit(this.maxspeed/2);
    this.position.add(this.velocity);
    this.acc.set(0, 0);
    this.borders()
    }
    
    // Death always looming
    this.health -= 0.2;
    this.reproduceDelay -= 0.2;
  }

  // Wraparound
  borders() {

    if (this.position.x < -this.r/2) {this.visto = false;
                                      this.position.x = width+this.r/2;}
    if (this.position.y < -this.r/2) {this.visto = false; this.position.y = height+this.r/2;}
    if (this.position.x > width+this.r/2) { this.visto = false; this.position.x = -this.r/2;}
    if (this.position.y > height+this.r/2) { this.visto = false; this.position.y = -this.r/2;}
  }

  // Method to display
  display() {
    let displayDelay = map(this.reproduceDelay,0,200,this.r,this.visao)
    fill(255,255,255, this.reproduceDelay);
    stroke(0, displayDelay);
    circle(this.position.x, this.position.y, displayDelay)
    ellipseMode(CENTER);
    stroke(0, this.health);
    fill(this.red,this.green,this.blue, this.health);
    ellipse(this.position.x, this.position.y, this.r, this.r);
    noFill()
    stroke(255,255,255)
    circle(this.position.x, this.position.y, this.visao)
  }

  // Death
  dead() {
    if (this.health < 0.0) {
      return true;
    } else {
      return false;
    }
  }
}
