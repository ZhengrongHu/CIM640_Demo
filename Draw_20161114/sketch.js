var video;

var vScale = 16;

var particles = [];

function setup(){
	fill(200);
	createCanvas(200, 200);
	pixelDensity(1);
	video = createCapture(VIDEO);
	video.size(width/vScale, height/vScale);
	for (var i = 0; i < 100; i ++){
	particle = new Particle(320, 240); 
}
	background(51);
}

function draw(){
	//background(51); 
	video.loadPixels();
	for (var i = 0; i < particles.lengthl i++){
	particle.update();
	particle.show();
	
}
}