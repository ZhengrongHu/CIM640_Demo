function Particle(x, y){
	this.x = x; 
	this.y = y;

	this.update = function(){
		this.x += random(-10, 10);
		this.y += random(-10, 10);
	}

}

this.show = function(){
	noStroke();

	var px = floor(this.x/vScale);
	var py = floor(this.y/vScale);
	var col = video.get(px, py);
	//console.log(col);

	fill( 20);
	ellipse(this.x, this.y, 24, 24); 
}
	