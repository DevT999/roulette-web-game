
Paint = function() {
	this.color = 0xFFFFFFFF;
	this.alpha = 255;
};

Paint.prototype.setColor = function(color) {
	this.color = color;
};

Paint.prototype.getColor = function() {
	return this.color;
};

Paint.prototype.setAlpha = function(alpha) {
	this.alpha = alpha;
};

Paint.prototype.getAlpha = function() {
	return this.alpha;
};