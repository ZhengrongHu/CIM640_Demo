var fishSchool;

function setup() {
  createCanvas(640, 480);
  // specify multiple formats for different browsers
  fishSchool = createVideo('assets/flocking.mp4');
  fishSchool.loop();
  fishSchool.hide();
  noStroke();
  fill(0);
}

function draw() {
  background(255);
  fishSchool.loadPixels();
  var stepSize = round(constrain(mouseX / 8, 6, 32));
  for (var y=0; y<height; y+=stepSize) {
    for (var x=0; x<width; x+=stepSize) {
      var i = y * width + x;
      var darkness = (255 - fishSchool.pixels[i*4]) / 255;
      var radius = stepSize * darkness;
      ellipse(x, y, radius, radius);
    }
  }
}