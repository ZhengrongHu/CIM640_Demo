var flock;

//fish
var offset = 100;
var x;
var y;
var Scale_Size;
var dir;

//water
var yoff = 0.0;
var xoff = 0.0;
var water_y;

//Color Picker
var topBoundary = 0;
var bottomBoundary = 0;

var boundary0 = 0;
var boundary1 = 0;
var boundary2 = 0;
var boundary3 = 0;
var boundary4 = 0;
var boundary5 = 0;
var boundary6 = 0;

var buttonSize = 100;

var currentColor = "black";
var brushSize = 10;

var currentArea = "";

////Here We Start to LOOP!
function setup() {
  createCanvas(1920,1080);
  createP();
  
  flock = new Flock();
  // Add an initial set of boids into the system
  for (var i = 0; i < 10; i++) {
    //generate starting from the center of the canvas 
    var b = new Boid(width/2,height/2);
    flock.addBoid(b);
  }
}

//DRAWING STARTS HERE!
function draw() {
  background(color(104,149,197));
  //here is the color piker
    // topBoundary = 400;
    // bottomBoundary = height;
    // boundary0 = 0;
    // boundary1 = width;
    // boundary2 = 200;
    // boundary3 = 300;
    // boundary4 = 400;
    // boundary5 = 500;
    // boundary6 = width;
  noStroke();
  drawWater()
  flock.run();
}

// Add a new boid into the System
function mouseDragged() {
  flock.addBoid(new Boid(mouseX,mouseY));
}

function Flock() {
  // An array for all the boids
  this.boids = []; // Initialize the array
}

Flock.prototype.run = function() {
  for (var i = 0; i < this.boids.length; i++) {
    this.boids[i].run(this.boids);  // Passing the entire list of boids to each boid individually
  }
}

Flock.prototype.addBoid = function(b) {
  this.boids.push(b);
}

// Boid class
// Methods for Separation, Cohesion, Alignment added

function Boid(x,y) {
  this.acceleration = createVector(0,0);
  this.velocity = createVector(random(-1,1),random(-1,1));
  this.position = createVector(x,y);
  this.r = 3.0;
  this.maxspeed = 3;    // Maximum speed
  this.maxforce = 0.05; // Maximum steering force
}

Boid.prototype.run = function(boids) {
  this.flock(boids);
  this.update();
  this.borders();
  this.render();
}

Boid.prototype.applyForce = function(force) {
  // We could add mass here if we want A = F / M
  this.acceleration.add(force);
}

// We accumulate a new acceleration each time based on three rules
Boid.prototype.flock = function(boids) {
  var sep = this.separate(boids);   // Separation
  var ali = this.align(boids);      // Alignment
  var coh = this.cohesion(boids);   // Cohesion
  // Arbitrarily weight these forces
  sep.mult(1.3);
  ali.mult(1.0);
  coh.mult(1.0);
  // Add the force vectors to acceleration
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
}

// Method to update location
Boid.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Boid.prototype.seek = function(target) {
  var desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Velocity
  var steer = p5.Vector.sub(desired,this.velocity);
  steer.limit(this.maxforce);  // Limit to maximum steering force
  return steer;
}

function drawWater() {
  background(51);
  fill(255);
  beginShape();
  xoff = yoff;
  
  //iteration over horizentail
  for (var water_x = 0; water_x <= width; water_x += 10){
    //caculate a y value according to noise, map to (0,1)
    var water_y = map(noise(xoff, yoff), 0, 1, 500, 180);
    //vertex
    vertex(water_x, water_y);
    xoff += 0.05;
  }
  yoff += 0.01;
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
  }
  
function drawFish(x,y,Scale_Size, dir) {
    fill(color(254,77,17));
    stroke(200);
  push();
  translate(x,y);
  scale(Scale_Size);
  beginShape();
  vertex(1.0*dir, -0.7);
  bezierVertex(1.0*dir, -0.7, 0.4*dir, -1.0, 0.0, 0.0);
  bezierVertex(0.0, 0.0, 1.0*dir, 0.4, 1.0*dir, -0.7); 
  endShape(CLOSE);
  pop();
  
  function drawColorPiker(){
    
  }

}

  Boid.prototype.render = function() {
    // Draw a triangle rotated in the direction of velocity
    var theta = this.velocity.heading() + radians(90);
    fill(180);
    stroke(200);
    push();
    translate(this.position.x,this.position.y);
    rotate(theta);
    drawFish(100, 100, 5, 3);
    scale(mouseX/60.0);
    drawFish(100,100,3,1);
    scale(mouseY*2.0);
    drawFish(100,100,3,1);
    pop();
  
  }
  
  
  // Wraparound
  Boid.prototype.borders = function() {
    if (this.position.x < -this.r)  this.position.x = width +this.r;
    if (this.position.y < -this.r)  this.position.y = height+this.r;
    if (this.position.x > width +this.r) this.position.x = -this.r;
    if (this.position.y > height+this.r) this.position.y = -this.r;
  }
  
  // Separation
  // Method checks for nearby boids and steers away
  Boid.prototype.separate = function(boids) {
    var desiredseparation = 25.0;
    var steer = createVector(0,0);
    var count = 0;
    // For every boid in the system, check if it's too close
    for (var i = 0; i < boids.length; i++) {
      var d = p5.Vector.dist(this.position,boids[i].position);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if ((d > 0) && (d < desiredseparation)) {
        // Calculate vector pointing away from neighbor
        var diff = p5.Vector.sub(this.position,boids[i].position);
        diff.normalize();
        diff.div(d);        // Weight by distance
        steer.add(diff);
        count++;            // Keep track of how many
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      steer.div(count);
    }
  
    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }
  
  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  Boid.prototype.align = function(boids) {
    var neighbordist = 50;
    var sum = createVector(0,0);
    var count = 0;
    for (var i = 0; i < boids.length; i++) {
      var d = p5.Vector.dist(this.position,boids[i].position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(boids[i].velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxspeed);
      var steer = p5.Vector.sub(sum,this.velocity);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return createVector(0,0);
    }
  }
  
  // Cohesion
  // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
  Boid.prototype.cohesion = function(boids) {
    var neighbordist = 50;
    var sum = createVector(0,0);   // Start with empty vector to accumulate all locations
    var count = 0;
    for (var i = 0; i < boids.length; i++) {
      var d = p5.Vector.dist(this.position,boids[i].position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(boids[i].position); // Add location
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum);  // Steer towards the location
    } else {
      return createVector(0,0);
    }
  }