
Color = function() {
	this.r = 0;
	this.g = 0;
	this.b = 0;
	this.a = 0;
};


/**
 * get string text to represent the color
 */
Color.colorToString = function(r, g, b) {
	var strColor = '#';
	
	if (!goog.isDef(g) || !goog.isDef(b)) {
		strColor += Color.oneByteToTwoBytes(MathUtils.decimalToHex(Color.getRedComponent(r)));
		strColor += Color.oneByteToTwoBytes(MathUtils.decimalToHex(Color.getGreenComponent(r)));
		strColor += Color.oneByteToTwoBytes(MathUtils.decimalToHex(Color.getBlueComponent(r)));
	}
	else {
		strColor += Color.oneByteToTwoBytes(MathUtils.decimalToHex(r));
		strColor += Color.oneByteToTwoBytes(MathUtils.decimalToHex(g));
		strColor += Color.oneByteToTwoBytes(MathUtils.decimalToHex(b));
	}
	
	return strColor;
};

/**
 * convert one byte color to two byte color
 */
Color.oneByteToTwoBytes = function(color) {
	if (color.length == 1) {
		return ('0' + color);
	}
	else {
		return color;
	}
};

/**
 * get alpha component of specified color
 */
Color.getAlphaComponent = function(color) {
	return MathUtils.toUByte((color & 0xFF000000) >> 24);
};

/**
 * get red component of specified color
 */
Color.getRedComponent = function(color) {
	return MathUtils.toUByte((color & 0x00FF0000) >> 16);
};

/**
 * get green component of specified color
 */
Color.getGreenComponent = function(color) {
	return MathUtils.toUByte((color & 0x0000FF00) >> 8);
};

/**
 * get blue component of specified color
 */
Color.getBlueComponent = function(color) {
	return MathUtils.toUByte(color & 0x000000FF);
};
