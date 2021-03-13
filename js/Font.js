
////////////////////////////////////////////////////////////
// class definition
////////////////////////////////////////////////////////////

Font = function() {
	this.rFamily = "Arial";
	this.rStyle = 0;
	this.rSize = 32;
	this.rWeight = 400;
	this.rColor = 'rgba(0, 0, 0, 1)';
};

/////////////////////////////////////////////////////////
//constant definition
/////////////////////////////////////////////////////////

//style constant
Font.STYLE_PLAIN 		= 0;
Font.STYLE_BOLD 		= 1;
Font.STYLE_ITALIC 		= 2;
Font.STYLE_UNDERLINED 	= 4;

//size constant
Font.SIZE_SMALL 		= 8;
Font.SIZE_MEDIUM 		= 0;
Font.SIZE_LARGE 		= 16;

//face constant
Font.FACE_SYSTEM 		= 0;
Font.FACE_MONOSPACE 	= 32;
Font.FACE_PROPORTIONAL 	= 64;

/**
 * set font family name
 */
Font.prototype.setFamilyName = function(rFamily) {
	this.rFamily = rFamily;
};

/**
 * get current setted font family name
 */
Font.prototype.getFamilyName = function() {
	return this.rFamily;
};

/**
 * set font style
 */
Font.prototype.setStyle = function(rStyle) {
	this.rStyle = rStyle;
	
	if ((rStyle & Font.STYLE_BOLD) == Font.STYLE_BOLD) {
		this.rWeight = 800;
	}
	else {
		this.rWeight = 400;
	}
};

/**
 * get current setted font style
 */
Font.prototype.getStyle = function() {
	return this.rStyle;
};

/**
 * set font size
 */
Font.prototype.setSize = function(rSize) {
	this.rSize = rSize;
};

/**
 * set current font size
 */
Font.prototype.getSize = function() {
	return this.rSize;
};

/**
 * set font weight
 */
Font.prototype.setWeight = function(rWeight) {
	this.rWeight = rWeight;
};

/**
 * get current font weight
 */
Font.prototype.getWeight = function() {
	return this.rWeight;
};

/**
 * Indicates whether or not this <code>Font</code> object's style is
 * BOLD.
 * @return    <code>true</code> if this <code>Font</code> object's
 *            style is BOLD;
 *            <code>false</code> otherwise.
 */
Font.prototype.isBold = function() {
	return ((this.rStyle & Font.STYLE_BOLD) == Font.STYLE_BOLD);
};

/**
 * Indicates whether or not this <code>Font</code> object's style is
 * ITALIC.
 * @return    <code>true</code> if this <code>Font</code> object's
 *            style is ITALIC;
 *            <code>false</code> otherwise.
 */
Font.prototype.isItalic = function() {
	return ((this.rStyle & Font.STYLE_ITALIC) == Font.STYLE_ITALIC);
};

/**
 * Indicates whether or not this <code>Font</code> object's style is
 * PLAIN.
 * @return    <code>true</code> if this <code>Font</code> has a
 *            PLAIN sytle;
 *            <code>false</code> otherwise.
 */
Font.prototype.isPlain = function() {
	return (this.rStyle == Font.STYLE_PLAIN);
};

/**
 * Indicates whether or not this <code>Font</code> object's style is
 * UNDERLINE.
 * @return    <code>true</code> if this <code>Font</code> has a
 *            UNDERLINE sytle;
 *            <code>false</code> otherwise.
 */
Font.prototype.isUnderlined = function() {
	return ((this.rStyle & Font.STYLE_UNDERLINED) == Font.STYLE_UNDERLINED);
};

/**
 * set font color
 */
Font.prototype.setColor = function(r, g, b, a) {
	if (arguments.length == 1)
		this.rColor = r;
	else
		this.rColor = 'rgba(' + r + ',' + g + ',' + b + ',' + a / 255 + ')';
};

/**
 * get current font color
 */
Font.prototype.getColor = function() {
	return this.rColor;
};

/**
 * get current font height
 */
Font.prototype.getHeight = function() {
	return this.rSize;
};

/**
 * get the width of specified character
 */
Font.prototype.charWidth = function(chr) {
	return this.substringWidth(chr, 0, 1);
};

/**
 * Gets the total advance width for showing the specified
 * <code>String</code>
 * in this <code>Font</code>.
 * The advance width is the horizontal distance that would be occupied if
 * <code>str</code> were to be drawn using this <code>Font</code>, 
 * including inter-character spacing following
 * <code>str</code> necessary for proper positioning of subsequent text.
 * 
 * @param str the <code>String</code> to be measured
 * @return the total advance width
 * @throws NullPointerException if <code>str</code> is <code>null</code>
 */
Font.prototype.stringWidth = function(str) {
	return this.substringWidth(str, 0, str.length);
};

/**
 * Gets the total advance width for showing the specified substring in this
 * <code>Font</code>.
 * The advance width is the horizontal distance that would be occupied if
 * the substring were to be drawn using this <code>Font</code>,
 * including inter-character spacing following
 * the substring necessary for proper positioning of subsequent text.
 *
 * <p>
 * The <code>offset</code> and <code>len</code> parameters must
 * specify a valid range of characters
 * within <code>str</code>. The <code>offset</code> parameter must
 * be within the
 * range <code>[0..(str.length())]</code>, inclusive.
 * The <code>len</code> parameter must be a non-negative
 * integer such that <code>(offset + len) &lt;= str.length()</code>.
 * </p>
 *
 * @param str the <code>String</code> to be measured
 * @param offset zero-based index of first character in the substring
 * @param len length of the substring
 * @return the total advance width
 * @throws StringIndexOutOfBoundsException if <code>offset</code> and
 * <code>length</code> specify an
 * invalid range
 * @throws NullPointerException if <code>str</code> is <code>null</code>
 */
Font.prototype.substringWidth = function(str, offset, len) {
	var str1 = '';
	if (!goog.isDef(offset) || !goog.isDef(len)) {
		str1 = str;
	}
	else {
		str1 = str.substring(offset, offset + len);
	}
	if (Graphics.MainGraphics == null) {
		var label = new lime.Label();
		
		label.setText(str1);
		var size = label.measureText();
		
		return size.width;
	}
	else {
		var oldFont = Graphics.MainGraphics.getFont();
		Graphics.MainGraphics.setFont(this);
		var sw = Graphics.MainGraphics.stringWidth(str1);
		Graphics.MainGraphics.setFont(oldFont);
		
		return sw;
	}
};

/**
 * Gets the distance in pixels from the top of the text to the text's
 * baseline.
 * @return the distance in pixels from the top of the text to the text's
 * baseline
 */
Font.prototype.getBaselinePosition = function() {
	return this.rSize - 2;
};

/**
 * Obtains an object representing a font having the specified face, style,
 * and size. If a matching font does not exist, the system will
 * attempt to provide the closest match. This method <em>always</em> 
 * returns
 * a valid font object, even if it is not a close match to the request. 
 *
 * @param face one of <code>FACE_SYSTEM</code>,
 * <code>FACE_MONOSPACE</code>, or <code>FACE_PROPORTIONAL</code>
 * @param style <code>STYLE_PLAIN</code>, or a combination of
 * <code>STYLE_BOLD</code>,
 * <code>STYLE_ITALIC</code>, and <code>STYLE_UNDERLINED</code>
 * @param size one of <code>SIZE_SMALL</code>, <code>SIZE_MEDIUM</code>,
 * or <code>SIZE_LARGE</code>
 * @return instance the nearest font found
 * @throws IllegalArgumentException if <code>face</code>, 
 * <code>style</code>, or <code>size</code> are not
 * legal values
 */
Font.getFont = function(jFace, jStyle, jSize) {
	var font = new Font();
	
	//0 = system, 32 = monospace and 64 = proportional
	switch (jFace)
	{
	case Font.FACE_SYSTEM:
		font.setFamilyName('system');
		break;
		
	case Font.FACE_MONOSPACE:
		font.setFamilyName('monospace');
		break;
		
	case Font.FACE_PROPORTIONAL:
		font.setFamilyName('proportional');
		break;
		
	default:
		font.setFamilyName('Arial');
		break;
	};
	
	font.setStyle(jStyle);
	
	switch (jSize)
	{
	case Font.SIZE_SMALL:
		font.setSize(16);
		break;
		
	case Font.SIZE_MEDIUM:
		font.setSize(30);
		break;
		
	case Font.SIZE_LARGE:
		font.setSize(30);
		break;
		
	default:
		font.setSize(16);
		break;
	};
	
//	font.setSize(16);
	
	return font;
};

Font.prototype.apply = function(label, idx) {
	label[idx].setFontFamily(this.rFamily);
	label[idx].setFontSize(this.rSize);
	label[idx].setFontWeight(this.rWeight);
	label[idx].setFontColor(this.rColor);

	if ((this.rStyle & Font.STYLE_PLAIN) == Font.STYLE_PLAIN) {
		label[idx].setFontStyle('normal');
	}

	if ((this.rStyle & Font.STYLE_ITALIC) == Font.STYLE_ITALIC) {
		label[idx].setFontStyle('italic');
	}

	if ((this.rStyle & Font.STYLE_UNDERLINED) == Font.STYLE_UNDERLINED) {
		label[0].setTextDecoration('underline');
	}
	else {
		label[0].setTextDecoration('none');
	}
};