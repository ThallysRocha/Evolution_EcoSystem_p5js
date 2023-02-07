// Constructor
class World {
  constructor(num) {
    // Start with initial food and creatures
    this.food = new Food(num);
    this.bloops = []; // An array for all creatures
    for (let i = 0; i < num; i++) {
      let l = createVector(random(width), random(height));
      let dna = new DNA();
      this.bloops.push(new Bloop(l, dna));
    }
  }

  // Make a new creature
  born(x, y) {
    let l = createVector(x, y);
    let dna = new DNA();
    this.bloops.push(new Bloop(l, dna));
  }
  crossover(bloop1,bloop2){
    let newBornGenes = [] 
    for(let i = 0 ; i < bloop1.dna.genes.length ; i++){
      let menorMaior = (bloop1.dna.genes[i] < bloop2.dna.genes[i]?[bloop1.dna.genes[i],bloop2.dna.genes[i]]:[bloop2.dna.genes[i],bloop1.dna.genes[i]])
      newBornGenes.push(map(random(0,1),0,1,menorMaior[0],menorMaior[1]))
    }
    
    return newBornGenes
      
  }
 reproduce(bloop1,bloop2) {
    // sexual reproduction      
    // let childGenes = random(1) < 0.5 ? [bloop1.dna.genes[0],bloop2.dna.genes[1]]:[bloop1.dna.genes[1],bloop2.dna.genes[0]];
      let childGenes = this.crossover(bloop1,bloop2)
      let childDNA = new DNA(childGenes)
      // Child DNA can mutate
      childDNA.mutate(0.01);
   
      let position = (bloop2.position);
      return new Bloop(position, childDNA);    
  }
  // Run the world
  run() {
    // Deal with food
    this.food.run();
    
    // Cycle through the ArrayList backwards b/c we are deleting
    for (let i = this.bloops.length - 1; i >= 0; i--) {
      // All bloops run and eat
      let b = this.bloops[i];
      b.run();
      b.eat(this.food);
      // If it's dead, kill it and make food
      if (b.dead()) {
        this.bloops.splice(i, 1);
        this.food.add(b.position);
      }
      
      // Perhaps this bloop would like to make a baby?
      for(let j = this.bloops.length - 1;j>=0;j--){
        let b2 = this.bloops[j]
        let menor;
        if(b!=b2){
          
          menor = b.visao < b2.visao?b.visao:b2.visao
          
          if((menor > p5.Vector.dist(b.position, b2.position))&&b.sexualmenteAtivo&&b2.sexualmenteAtivo){
            if(random(1) < 0.5){
               b.reproduceDelay = 200
               b2.reproduceDelay = 200
               let child = this.reproduce(b,b2)
               this.bloops.push(child)
               }
            }
        }        
        
      }
    }
  }
}