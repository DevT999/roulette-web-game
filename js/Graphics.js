
Graphics = function(context) {
	this.context 	= context;		// canvas context
	if (this.context != null) {
		this.context.globalCompositeOperation = 'source-over';
	}

	this.font		= new Font();	// draw font
	
	this.color		= 0x000000;		// draw color
	this.colorR 	= 0;			// red color
	this.colorG 	= 0;			// green color
	this.colorB 	= 0;			// blue color
	this.colorA		= 255;			// alpha value
	
	this.strokeColor = 0x000000;	// stroke color
	this.fillColor	 = 0x000000;	// fill color
	
	this.tx			= 0;			// translate x position
	this.ty			= 0;			// translate y position
	
	// clip variables (x, y, width, height)
	this.clipX		= 0;
	this.clipY		= 0;
	this.clipWidth 	= 0;
	this.clipHeight	= 0;
	
	this.oclipX			= 0;
	this.oclipY			= 0;
	this.oclipWidth 	= 0;
	this.oclipHeight	= 0;
	
	this.grayScale 		= 0;	// gray scale color
	this.strokeStyle	= 0;	// stroke style for drawing the line, rectangle, etc.
	/*
	if (Graphics.MainGraphics == null) {
		Graphics.MainGraphics = this;
	}
	*/
};

//constant definition
// align constants
/**
 * Constant for centering text and images horizontally
 * around the anchor point
 *
 * <P>Value <code>1</code> is assigned to <code>HCENTER</code>.</P>
 */
Graphics.HCENTER 	= 1;

/**
 * Constant for centering images vertically
 * around the anchor point.
 *
 * <P>Value <code>2</code> is assigned to <code>VCENTER</code>.</P>
 */
Graphics.VCENTER 	= 2;

/**
 * Constant for positioning the anchor point of text and images
 * to the left of the text or image.
 *
 * <P>Value <code>4</code> is assigned to <code>LEFT</code>.</P>
 */
Graphics.LEFT		= 4;

/**
 * Constant for positioning the anchor point of text and images
 * to the right of the text or image.
 *
 * <P>Value <code>8</code> is assigned to <code>RIGHT</code>.</P>
 */
Graphics.RIGHT		= 8;

/**
 * Constant for positioning the anchor point of text and images
 * above the text or image.
 *
 * <P>Value <code>16</code> is assigned to <code>TOP</code>.</P>
 */
Graphics.TOP		= 16;

/**
 * Constant for positioning the anchor point of text and images
 * below the text or image.
 *
 * <P>Value <code>32</code> is assigned to <code>BOTTOM</code>.</P>
 */
Graphics.BOTTOM		= 32;

/**
 * Constant for positioning the anchor point at the baseline of text.
 *
 * <P>Value <code>64</code> is assigned to <code>BASELINE</code>.</P>
 */
Graphics.BASELINE	= 64;


/**
 * Constant for the <code>SOLID</code> stroke style.
 *
 * <P>Value <code>0</code> is assigned to <code>SOLID</code>.</P>
 */
Graphics.SOLID		= 0;

/**
 * Constant for the <code>DOTTED</code> stroke style.
 *
 * <P>Value <code>1</code> is assigned to <code>DOTTED</code>.</P>
 */
Graphics.DOTTED		= 1;

/**
 * Constant for the <code>BLACK</code> color.
 *
 * <P>Value <code>1</code> is assigned to <code>BLACK</code>.</P>
 */
Graphics.BLACK		= 1;

/**
 * Constant for the <code>WHITE</code> color.
 *
 * <P>Value <code>1</code> is assigned to <code>WHITE</code>.</P>
 */
Graphics.WHITE		= 0xFFFFFF;


// static variables
Graphics.MainGraphics = null;
Graphics.BackGraphics = null;

Graphics.NeedToDrawBack = true;

/**
 * clear entire area with specified color
 */
Graphics.prototype.clear = function(r, g, b, a) {
	if (this.context != null) {
		this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
/*
		this.context.save();
			if (arguments.length == 0) {
				this.context.fillStyle = 'rgba(255, 255, 255, 1)';
			}
			else {
				this.context.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a / 255 + ')';
			}
			this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
	    this.context.restore();
	    */
	}

};

/**
 * Intersects the current clip with the specified rectangle.
 * The resulting clipping area is the intersection of the current
 * clipping area and the specified rectangle.
 * This method can only be used to make the current clip smaller.
 * To set the current clip larger, use the <code>setClip</code> method.
 * Rendering operations have no effect outside of the clipping area.
 * @param x the x coordinate of the rectangle to intersect the clip with
 * @param y the y coordinate of the rectangle to intersect the clip with
 * @param width the width of the rectangle to intersect the clip with
 * @param height the height of the rectangle to intersect the clip with
 * @see #setClip(int, int, int, int)
 */
Graphics.prototype.clipRect = function(x, y, width, height) {
	this.setClip(x, y, width, height);
};

/**
 * save current clip state
 */
Graphics.prototype.clipSave = function() {
	this.oclipX 		= this.clipX;
	this.oclipY 		= this.clipY;
	this.oclipWidth 	= this.clipWidth;
	this.oclipHeight 	= this.clipHeight;
};

/**
 * restore saved clip state
 */
Graphics.prototype.clipRestore = function() {
	this.clipX 		= this.oclipX;
	this.clipY 		= this.oclipY;
	this.clipWidth 	= this.oclipWidth;
	this.clipHeight = this.oclipHeight;
};

/**
 * Copies the contents of a rectangular area
 * <code>(x_src, y_src, width, height)</code> to a destination area,
 * whose anchor point identified by anchor is located at
 * <code>(x_dest, y_dest)</code>.  The effect must be that the
 * destination area
 * contains an exact copy of the contents of the source area
 * immediately prior to the invocation of this method.  This result must
 * occur even if the source and destination areas overlap.
 *
 * <p>The points <code>(x_src, y_src)</code> and <code>(x_dest,
 * y_dest)</code> are both specified
 * relative to the coordinate system of the <code>Graphics</code>
 * object.  It is
 * illegal for the source region to extend beyond the bounds of the
 * graphic object.  This requires that: </P>
 * <TABLE BORDER="2">
 * <TR>
 * <TD ROWSPAN="1" COLSPAN="1">
 *    <pre><code>
 *   x_src + tx &gt;= 0
 *   y_src + ty &gt;= 0
 *   x_src + tx + width &lt;= width of Graphics object's destination
 *   y_src + ty + height &lt;= height of Graphics object's destination      </code></pre>
 * </TD>
 * </TR>
 * </TABLE>
 * 
 * <p>where <code>tx</code> and <code>ty</code> represent the X and Y 
 * coordinates of the translated origin of this graphics object, as 
 * returned by <code>getTranslateX()</code> and
 * <code>getTranslateY()</code>, respectively.</p>
 * 
 * <P>
 * However, it is legal for the destination area to extend beyond
 * the bounds of the <code>Graphics</code> object.  Pixels outside
 * of the bounds of
 * the <code>Graphics</code> object will not be drawn.</p>
 *
 * <p>The <code>copyArea</code> method is allowed on all
 * <code>Graphics</code> objects except those
 * whose destination is the actual display device.  This restriction is
 * necessary because allowing a <code>copyArea</code> method on
 * the display would
 * adversely impact certain techniques for implementing
 * double-buffering.</p>
 *
 * <p>Like other graphics operations, the <code>copyArea</code>
 * method uses the Source
 * Over Destination rule for combining pixels.  However, since it is
 * defined only for mutable images, which can contain only fully opaque
 * pixels, this is effectively the same as pixel replacement.</p>
 *
 * @param x_src  the x coordinate of upper left corner of source area
 * @param y_src  the y coordinate of upper left corner of source area
 * @param width  the width of the source area
 * @param height the height of the source area
 * @param x_dest the x coordinate of the destination anchor point
 * @param y_dest the y coordinate of the destination anchor point
 * @param anchor the anchor point for positioning the region within
 *        the destination image
 *
 * @throws IllegalStateException if the destination of this
 * <code>Graphics</code> object is the display device
 * @throws IllegalArgumentException if the region to be copied exceeds
 * the bounds of the source image
 */
Graphics.prototype.copyArea = function(x_src, y_src, width, height, x_dest, y_dest, anchor) {
	
};

/**
 * Draws the outline of a circular or elliptical arc
 * covering the specified rectangle,
 * using the current color and stroke style.
 * <p>
 * The resulting arc begins at <code>startAngle</code> and extends
 * for <code>arcAngle</code> degrees, using the current color.
 * Angles are interpreted such that <code>0</code>&nbsp;degrees
 * is at the <code>3</code>&nbsp;o'clock position.
 * A positive value indicates a counter-clockwise rotation
 * while a negative value indicates a clockwise rotation.
 * <p>
 * The center of the arc is the center of the rectangle whose origin
 * is (<em>x</em>,&nbsp;<em>y</em>) and whose size is specified by the
 * <code>width</code> and <code>height</code> arguments.
 * <p>
 * The resulting arc covers an area
 * <code>width&nbsp;+&nbsp;1</code> pixels wide
 * by <code>height&nbsp;+&nbsp;1</code> pixels tall.
 * If either <code>width</code> or <code>height</code> is less than zero,
 * nothing is drawn.
 *
 * <p> The angles are specified relative to the non-square extents of
 * the bounding rectangle such that <code>45</code> degrees always
 * falls on the
 * line from the center of the ellipse to the upper right corner of
 * the bounding rectangle. As a result, if the bounding rectangle is
 * noticeably longer in one axis than the other, the angles to the
 * start and end of the arc segment will be skewed farther along the
 * longer axis of the bounds. </p>
 *
 * @param x the <em>x</em> coordinate of the upper-left corner
 * of the arc to be drawn
 * @param y the <em>y</em> coordinate of the upper-left corner
 * of the arc to be drawn
 * @param width the width of the arc to be drawn
 * @param height the height of the arc to be drawn
 * @param startAngle the beginning angle
 * @param arcAngle the angular extent of the arc, relative to
 * the start angle
 * @see #fillArc(int, int, int, int, int, int)
 */
Graphics.prototype.drawArc = function(x, y, width, height, startAngle, arcAngle) {
	if (this.context == null) {
		return;
	}

	x += this.tx;
	y += this.ty;

	this.context.save();
	this.context.beginPath();
		this.context.arc(x + width / 2, y + height / 2, width / 2, startAngle, startAngle + arcAngle, false);
	this.context.closePath();
	this.context.stroke();
	this.context.restore();
};

/**
 * Draws the specified character using the current font and color.
 * @param character the character to be drawn
 * @param x the x coordinate of the anchor point
 * @param y the y coordinate of the anchor point
 * @param anchor the anchor point for positioning the text; see
 * <a href="#anchor">anchor points</a>
 *
 * @throws IllegalArgumentException if <code>anchor</code>
 * is not a legal value
 *
 * @see #drawString(java.lang.String, int, int, int)
 * @see #drawChars(char[], int, int, int, int, int)
 */
Graphics.prototype.drawChar = function(character, x, y, anchor) {
    this.drawString(String.fromCharCode(character), x,  y, anchor);
};

/**
 * Draws the specified characters using the current font and color.
 *
 * <p>The <code>offset</code> and <code>length</code> parameters must
 * specify a valid range of characters within
 * the character array <code>data</code>.
 * The <code>offset</code> parameter must be within the
 * range <code>[0..(data.length)]</code>, inclusive.
 * The <code>length</code> parameter
 * must be a non-negative integer such that
 * <code>(offset + length) &lt;= data.length</code>.</p>
 *
 * @param data the array of characters to be drawn
 * @param offset the start offset in the data
 * @param length the number of characters to be drawn
 * @param x the x coordinate of the anchor point
 * @param y the y coordinate of the anchor point
 * @param anchor the anchor point for positioning the text; see
 * <a href="#anchor">anchor points</a>
 *
 * @throws ArrayIndexOutOfBoundsException if <code>offset</code>
 * and <code>length</code>
 * do not specify a valid range within the data array
 * @throws IllegalArgumentException if anchor is not a legal value
 * @throws NullPointerException if <code>data</code> is <code>null</code>
 *
 * @see #drawString(java.lang.String, int, int, int)
 */
Graphics.prototype.drawChars = function(data, offset, len, x, y, anchor) {
    var str = "";
    for (var i = 0; i < len; i++)
        str += String.fromCharCode(data[offset + i]);
	this.drawString(str, x, y, anchor);
};

/**
 * Draws the specified image by using the anchor point.
 * The image can be drawn in different positions relative to
 * the anchor point by passing the appropriate position constants.
 * See <a href="#anchor">anchor points</a>.
 *
 * <p>If the source image contains transparent pixels, the corresponding
 * pixels in the destination image must be left untouched.  If the source
 * image contains partially transparent pixels, a compositing operation 
 * must be performed with the destination pixels, leaving all pixels of 
 * the destination image fully opaque.</p>
 *
 * <p>If <code>img</code> is the same as the destination of this Graphics
 * object, the result is undefined.  For copying areas within an
 * <code>Image</code>, {@link #copyArea copyArea} should be used instead.
 * </p>
 *
 * @param img the specified image to be drawn
 * @param x the x coordinate of the anchor point
 * @param y the y coordinate of the anchor point
 * @param anchor the anchor point for positioning the image
 * @throws IllegalArgumentException if <code>anchor</code>
 * is not a legal value
 * @throws NullPointerException if <code>img</code> is <code>null</code>
 * @see Image
 */
Graphics.prototype.drawImage = function(img, x, y, anchor, scaleWidth, scaleHeight, rotAngle) {
	var regionW = img.getWidth();		// int
	var regionH = img.getHeight();		// int

	this.drawRegion(img, 0, 0, regionW, regionH,
				Sprite.TRANS_NONE,
				x, y,
			    anchor,
			    scaleWidth, scaleHeight, rotAngle
				);	
};

Graphics.prototype.drawImageWithPaint = function(img, x, y, paint, rotAngle) {
    this.save();
    this.setGlobalAlpha(paint.getAlpha());
    if (arguments.length == 4)
	    this.drawImage(img, x, y, 0);
	else
		this.drawImage(img, x, y, 0, 1024, 1024, rotAngle);
	//this.drawRect(x, y, img.width, img.height);
    this.restore();
};

Graphics.prototype.drawImagePart = function(img, dx, dy, dw, dh, sx, sy, sw, sh, img_reverse) {
    if (this.context == null) {
    	return;
    }
    if (dw == 0 || dh == 0 || sw == 0 || sh == 0)
    	return;
    
    if (img.getCanvas() != null) {
	    try {
	    	if (img_reverse == true)
	    	{
		    	this.context.save();
		    	
	    		this.context.translate(dx, dy);
	    		this.context.scale(-1, 1);
	    	    this.context.drawImage(img.getCanvas(), sx, sy, sw, sh, -dw, 0, dw, dh);
	    	    
	    		this.context.restore();
			}
	    	else
	    	{
	    		this.context.drawImage(img.getCanvas(), sx, sy, sw, sh, dx, dy, dw, dh);
	    	}
		}
		catch (err) {
			Debugger.exceptionCaught(err, "draw image");
		}
    }
}

Graphics.prototype.drawImageStretch = function(img, x, y, w, h) {
    if (this.context == null) {
    	return;
    }
    
    if (img.getCanvas() != null) {
	    try {
    	    this.context.drawImage(img.getCanvas(), 0, 0, img.getWidth(), img.getHeight(), x, y, w, h);
		}
		catch (err) {
			Debugger.exceptionCaught(err, "draw image");
		}
    }
};

Graphics.prototype.drawImage_org = function(img, destLeft, destTop, destRight, destBottom, sourLeft, sourTop, sourRight, sourBottom, reserved) {
    if (this.context == null) {
    	return;
    }
    
    var regionW = destRight - destLeft;
    var regionH = destBottom - destTop;
    
    if (img.getCanvas() != null) {
	    try {
    	    this.context.drawImage(img.getCanvas(), sourLeft, sourTop, regionW, regionH, destLeft,destTop, regionW, regionH);
		}
		catch (err) {
			Debugger.exceptionCaught(err, "draw image");
		}
    }
};

/**
 * Copies a region of the specified source image to a location within
 * the destination, possibly transforming (rotating and reflecting)
 * the image data using the chosen transform function.
 *
 * <p>The destination, if it is an image, must not be the same image as
 * the source image.  If it is, an exception is thrown.  This restriction
 * is present in order to avoid ill-defined behaviors that might occur if
 * overlapped, transformed copies were permitted.</p>
 *
 * <p>The transform function used must be one of the following, as defined
 * in the {@link javax.microedition.lcdui.game.Sprite Sprite} class:<br>
 *
 * <code>Sprite.TRANS_NONE</code> - causes the specified image
 * region to be copied unchanged<br>
 * <code>Sprite.TRANS_ROT90</code> - causes the specified image
 * region to be rotated clockwise by 90 degrees.<br>
 * <code>Sprite.TRANS_ROT180</code> - causes the specified image
 * region to be rotated clockwise by 180 degrees.<br>
 * <code>Sprite.TRANS_ROT270</code> - causes the specified image
 * region to be rotated clockwise by 270 degrees.<br>
 * <code>Sprite.TRANS_MIRROR</code> - causes the specified image
 * region to be reflected about its vertical center.<br>
 * <code>Sprite.TRANS_MIRROR_ROT90</code> - causes the specified image
 * region to be reflected about its vertical center and then rotated
 * clockwise by 90 degrees.<br>
 * <code>Sprite.TRANS_MIRROR_ROT180</code> - causes the specified image
 * region to be reflected about its vertical center and then rotated
 * clockwise by 180 degrees.<br>
 * <code>Sprite.TRANS_MIRROR_ROT270</code> - causes the specified image
 * region to be reflected about its vertical center and then rotated
 * clockwise by 270 degrees.<br></p>
 *
 * <p>If the source region contains transparent pixels, the corresponding
 * pixels in the destination region must be left untouched.  If the source
 * region contains partially transparent pixels, a compositing operation
 * must be performed with the destination pixels, leaving all pixels of
 * the destination region fully opaque.</p>
 *
 * <p> The <code>(x_src, y_src)</code> coordinates are relative to
 * the upper left
 * corner of the source image.  The <code>x_src</code>,
 * <code>y_src</code>, <code>width</code>, and <code>height</code>
 * parameters specify a rectangular region of the source image.  It is
 * illegal for this region to extend beyond the bounds of the source
 * image.  This requires that: </P>
 * <TABLE BORDER="2">
 * <TR>
 * <TD ROWSPAN="1" COLSPAN="1">
 *    <pre><code>
 *   x_src &gt;= 0
 *   y_src &gt;= 0
 *   x_src + width &lt;= source width
 *   y_src + height &lt;= source height    </code></pre>
 * </TD>
 * </TR>
 * </TABLE>
 * <P>
 * The <code>(x_dest, y_dest)</code> coordinates are relative to
 * the coordinate
 * system of this Graphics object.  It is legal for the destination
 * area to extend beyond the bounds of the <code>Graphics</code>
 * object.  Pixels
 * outside of the bounds of the <code>Graphics</code> object will
 * not be drawn.</p>
 *
 * <p>The transform is applied to the image data from the region of the
 * source image, and the result is rendered with its anchor point
 * positioned at location <code>(x_dest, y_dest)</code> in the
 * destination.</p>
 *
 * @param src the source image to copy from
 * @param x_src the x coordinate of the upper left corner of the region
 * within the source image to copy
 * @param y_src the y coordinate of the upper left corner of the region
 * within the source image to copy
 * @param width the width of the region to copy
 * @param height the height of the region to copy
 * @param transform the desired transformation for the selected region
 * being copied
 * @param x_dest the x coordinate of the anchor point in the
 * destination drawing area
 * @param y_dest the y coordinate of the anchor point in the
 * destination drawing area
 * @param anchor the anchor point for positioning the region within
 * the destination image
 *
 * @throws IllegalArgumentException if <code>src</code> is the
 * same image as the
 * destination of this <code>Graphics</code> object
 * @throws NullPointerException if <code>src</code> is <code>null</code>
 * @throws IllegalArgumentException if <code>transform</code> is invalid
 * @throws IllegalArgumentException if <code>anchor</code> is invalid
 * @throws IllegalArgumentException if the region to be copied exceeds
 * the bounds of the source image
 * @since MIDP 2.0
 */
Graphics.prototype.drawRegion = function(img, sourX, sourY, sizeX, sizeY, transform, destX, destY, anchor, scaleWidth, scaleHeight, rotAngle) {
	if (this.context == null)
		return;
	
	destX += this.tx;
	destY += this.ty;
	
	destX += Graphics.getHorizontalAnchor(anchor, sizeX);
	destY += Graphics.getVerticalAnchor(anchor, sizeY);

	if ((transform & Sprite.TRANS_MIRROR_ROT270) == Sprite.TRANS_MIRROR_ROT270 ||
		(transform & Sprite.TRANS_MIRROR_ROT90) == Sprite.TRANS_MIRROR_ROT90 ||
		(transform & Sprite.TRANS_ROT270) == Sprite.TRANS_ROT270 ||
	    (transform & Sprite.TRANS_ROT90) == Sprite.TRANS_ROT90) {
        var tmp = sizeX;
        sizeX = sizeY;
        sizeY = tmp;          
	}
    
	if ((destX + sizeX) <= this.getClipX()
			|| (destY + sizeY) <= this.getClipY()
			|| destX >= (this.getClipX() + this.getClipWidth())
			|| destY >= (this.getClipY() + this.getClipHeight())) {
			// Not visible
			return;
	}
	
    var ox = 0, oy = 0, ow = 0, oh = 0;
	
	var dx = this.getClipX() - destX;		// int
	if (dx > 0) {
		ox += dx;
	}
	var dy = this.getClipY() - destY;		// int
	if (dy > 0) {
		oy += dy;
	}
	
	dx = (destX + sizeX) - (this.getClipX() + this.getClipWidth());
	if (dx > 0) {
		ow -= dx;
	}

	dy = (destY + sizeY) - (this.getClipY() + this.getClipHeight());
	if (dy > 0) {
		oh -= dy;
	}
	
	if (sizeX + ow - ox <= 0 || sizeY + oh - oy <= 0) {
		return;
	}

	if ((transform & Sprite.TRANS_MIRROR_ROT270) == Sprite.TRANS_MIRROR_ROT270 ||
		(transform & Sprite.TRANS_MIRROR_ROT90) == Sprite.TRANS_MIRROR_ROT90 ||
		(transform & Sprite.TRANS_ROT270) == Sprite.TRANS_ROT270 ||
	    (transform & Sprite.TRANS_ROT90) == Sprite.TRANS_ROT90) {
        var tmp = sizeX;
        sizeX = sizeY;
        sizeY = tmp;
        tmp = ow;
        ow = oh;
        oh = tmp;
	}
	
	var image = img;//getImage(img);		// Image

	var w  = sizeX + ow - ox, h = sizeY + oh - oy;
	this.context.save();
	switch (transform)
	{
		case Sprite.TRANS_MIRROR:			// flip X
			this.context.translate(destX + ox, destY + oy);
			this.context.scale(-1, 1);
			this.drawImage_org(image,
					-w, 0, 0, h,
					sourX - ow, sourY + oy, sourX + sizeX - ox, sourY + sizeY + oh,
					null);
			break;
	
		case Sprite.TRANS_MIRROR_ROT180:	// flip Y
			this.context.translate(destX + ox, destY + oy);
			this.context.scale(1, -1);
			this.drawImage_org(image,
					0, -h, w, 0,
					sourX + ox, sourY - oh, sourX + sizeX + ow, sourY + sizeY - oy,
					null);
			break;
	
		case Sprite.TRANS_ROT180:			// flip XY
			this.context.translate(destX + ox, destY + oy);
			this.context.scale(-1, -1);
			this.drawImage_org(image,
					-w, -h, 0, 0,
					sourX - ow, sourY - oh, sourX + sizeX - ox, sourY + sizeY - oy,
					null);
			break;
			
		case Sprite.TRANS_ROT90: case Sprite.TRANS_ROT270: case Sprite.TRANS_MIRROR_ROT90: case Sprite.TRANS_MIRROR_ROT270:
			var sw = 1, sh = 1, rot = 90;
			if (transform == Sprite.TRANS_ROT270 || transform == Sprite.TRANS_MIRROR_ROT270)
				rot = 270;
			if (transform == Sprite.TRANS_MIRROR_ROT90 || transform == Sprite.TRANS_MIRROR_ROT270)
				sw = -1;
	        this.context.translate(destX + ox + w / 2, destY + oy + h / 2);
	        this.context.rotate(rot * Math.PI / 180);
	        this.context.scale(sw, sh);
			this.drawImage_org(image, -w / 2, -h / 2, w, h,
							   sourX + ox, sourY + oy , sourX + sizeX + ow, sourY + sizeY + oh, null);
			break;
		
		// In other cases we do the transformations by modifying pixel buffer
		default:
			var sw = 1, sh = 1, rot = 0;
			
			switch (arguments.length)
			{
				case 10:
					if (scaleWidth != undefined)
						sw = scaleWidth;
					break;
				
				case 11:
					if (scaleHeight != undefined)
						sh = scaleHeight;
					break;
				
				case 12:
					if (rotAngle != undefined)
						rot = rotAngle;
					//rot = rotAngle / 256;
					//rot = Math.floor(rot / 64) * 90 + (rot % 64) * 90 / 64;
					break;
			}
			
			if (rot != 0) {
				//this.context.beginPath();
				//this.context.rect(destX + ox, destY + oy, w, h);
				//this.context.clip();
		        this.context.translate(destX + sizeX / 2, destY + sizeY / 2);// - 21);
		        this.context.rotate(rot * Math.PI / 180);
		        var top = -sizeY / 2;// + 21;
				this.drawImage_org(image, -sizeX / 2, top, sizeX / 2, top + sizeY,
								   sourX, sourY, sourX + sizeX, sourY + sizeY, null);
		        //this.context.translate(-(destX + sizeX / 2), -(destY + sizeY / 2 + 16))	;
		        //this.context.translate(-(destX + sizeX / 2), -(destY + sizeY / 2));
			}
			else {
				var tx = -(destX + ox) * (sw - 1) / sw + (sw < 0 ? -w : 0);
				var ty = -(destY + oy) * (sh - 1) / sh + (sh < 0 ? -h : 0);
				
				this.context.translate(destX + ox, destY + oy);
				this.drawImage_org(image, tx, ty, tx + w, ty + h,
								   sourX + ox, sourY + oy , sourX + sizeX + ow, sourY + sizeY + oh, null);
			}
	}

	this.context.restore();
	
	if (transform < 0 || transform > 8)
	{
		console.log("Graphics.drawRegion(transformation not emulated: "+transform+")");			
	}
};

/**
 * Does transformation to a int buffer representing an image
 * 
 * @param buffer				Buffer to transform
 * @param w						Width
 * @param h						Height
 * @param transformation		TRANS_MIRROR_HORIZONTAL, TRANS_MIRROR_VERTICAL. Can be also TRANS_NONE when nothing is done
 */
// private void transformBuffer(int[] buffer, int w, int h, int transformation)
Graphics.prototype.transformBuffer = function(buffer, w, h, transformation) {
	// Horizontal flip (mirroring)
	if ((transformation & (Sprite.TRANS_MIRROR)) != 0)
	{
		var halfW = w >> 1;		// int
		var i = 0;				// int
		for (var y = h; --y >= 0;)
		{
			var a = i + w - 1;		// int
		
			for (var endX = i + halfW; i < endX;)
			{
				var temp = buffer[i];		// int
				buffer[i++] = buffer[a];
				buffer[a--] = temp;					
			}
			i += w - halfW;
		}
	}

	// Vertical flip
	if ((transformation & (Sprite.TRANS_MIRROR_ROT180)) != 0)
	{
		var bottomRow = (h - 1) * w;		// int
		var halfH = (h >> 1) * w;			// int

		for (var x = w; --x >= 0;)
		{
			var i = x;					// int
			var a = bottomRow + x;		// int

			for (var endY = i + halfH; i < endY;)
			{
				var temp = buffer[i];			// int
				buffer[i] = buffer[a];
				buffer[a] = temp;

				i += w;
				a -= w;
			}
		}
	}

	// Mirror 270
	if ((transformation & Sprite.TRANS_MIRROR_ROT270) != 0)
	{
		// First do mirroring again
		this.transformBuffer(buffer, w, h, Sprite.TRANS_MIRROR);
		
		var tempBuffer = new_array(1, 0, w * h);		// int[]

		// Copy already transformed pixels to temp buffer
		for (var a = w * h; --a >= 0;)
		{
			tempBuffer[a] = buffer[a];
		}

		var i = 0;		// int
		for (var x = 0; x < w; x++)
		{
			var a = (h - 1) * w + x;		// int
			for (var y = h; --y >= 0;)
			{
				buffer[i++] = tempBuffer[a];
				a -= w;
			}
		}		
	}
};

/**
 * get horizontal anchor value
 */
Graphics.getHorizontalAnchor = function(anchor, width) {
	if ((anchor & Graphics.HCENTER) != 0)
	{
		return -(width >> 1);
	}
	else if ((anchor & Graphics.RIGHT) != 0)
	{
		return -width;
	}

	return 0;
};

/**
 * get vertical anchor value
 */
Graphics.getVerticalAnchor = function(anchor, height) {
	if ((anchor & Graphics.VCENTER) != 0)
	{
		return -(height >> 1);
	}
	else if ((anchor & Graphics.BOTTOM) != 0)
	{
		return -height;
	}

	return 0;
};

/**
 * Draws a line between the coordinates <code>(x1,y1)</code> and
 * <code>(x2,y2)</code> using
 * the current color and stroke style.
 * @param x1 the x coordinate of the start of the line
 * @param y1 the y coordinate of the start of the line
 * @param x2 the x coordinate of the end of the line
 * @param y2 the y coordinate of the end of the line
 */
Graphics.prototype.drawLine = function(x1, y1, x2, y2) {
	if (this.context == null) {
		return;
	}

	x1 += this.tx;
	y1 += this.ty;
	x2 += this.tx;
	y2 += this.ty;
	
	this.context.save();
		this.context.beginPath();
		this.context.moveTo(x1, y1);
		this.context.lineTo(x2, y2);
		this.context.closePath();
		
		this.context.stroke();
	this.context.restore();
};

/**
 * Draws the outline of the specified rectangle using the current
 * color and stroke style.
 * The resulting rectangle will cover an area <code>(width + 1)</code>
 * pixels wide by <code>(height + 1)</code> pixels tall.
 * If either width or height is less than
 * zero, nothing is drawn.
 * @param x the x coordinate of the rectangle to be drawn
 * @param y the y coordinate of the rectangle to be drawn
 * @param width the width of the rectangle to be drawn
 * @param height the height of the rectangle to be drawn
 * @see #fillRect(int, int, int, int)
 */
Graphics.prototype.drawRect = function(x, y, width, height) {
	if (this.context == null) {
		return;
	}

	x += this.tx;
	y += this.ty;

	var dx = this.getClipX() - x;		// int
	if (dx > 0) {
		width -= dx;
		x = this.getClipX();
	}
	var dy = this.getClipY() - y;		// int
	if (dy > 0) {
		height -= dy;
		y = this.getClipY();
	}
	
	dx = (x + width) - (this.getClipX() + this.getClipWidth());
	if (dx > 0) {
		width -= dx;
	}

	dy = (y + height) - (this.getClipY() + this.getClipHeight());
	if (dy > 0) {
		height -= dy;
	}
	
	if (width <= 0 || height <= 0) {
		return;
	}	
	
	this.context.save();
		this.context.strokeRect(x, y, width, height);
	this.context.restore();
};

/**
 * Renders a series of device-independent RGB+transparency values in a
 * specified region.  The values are stored in
 * <code>rgbData</code> in a format
 * with <code>24</code> bits of RGB and an eight-bit alpha value
 * (<code>0xAARRGGBB</code>),
 * with the first value stored at the specified offset.  The
 * <code>scanlength</code>
 * specifies the relative offset within the array between the
 * corresponding pixels of consecutive rows.  Any value for
 * <code>scanlength</code> is acceptable (even negative values)
 * provided that all resulting references are within the
 * bounds of the <code>rgbData</code> array. The ARGB data is
 * rasterized horizontally from left to right within each row.
 * The ARGB values are
 * rendered in the region specified by <code>x</code>,
 * <code>y</code>, <code>width</code> and <code>height</code>, and
 * the operation is subject to the current clip region
 * and translation for this <code>Graphics</code> object.
 *
 * <p>Consider <code>P(a,b)</code> to be the value of the pixel
 * located at column <code>a</code> and row <code>b</code> of the
 * Image, where rows and columns are numbered downward from the
 * top starting at zero, and columns are numbered rightward from
 * the left starting at zero. This operation can then be defined
 * as:</p>
 *
 * <TABLE BORDER="2">
 * <TR>
 * <TD ROWSPAN="1" COLSPAN="1">
 *    <pre><code>
 *    P(a, b) = rgbData[offset + (a - x) + (b - y) * scanlength]       </code></pre>
 * </TD>
 * </TR>
 * </TABLE>
 *
 * <p> for </p>
 *
 * <TABLE BORDER="2">
 * <TR>
 * <TD ROWSPAN="1" COLSPAN="1">
 *    <pre><code>
 *     x &lt;= a &lt; x + width
 *     y &lt;= b &lt; y + height    </code></pre>
 * </TD>
 * </TR>
 * </TABLE>
 * <p> This capability is provided in the <code>Graphics</code>
 * class so that it can be
 * used to render both to the screen and to offscreen
 * <code>Image</code> objects.  The
 * ability to retrieve ARGB values is provided by the {@link Image#getRGB}
 * method. </p>
 *
 * <p> If <code>processAlpha</code> is <code>true</code>, the
 * high-order byte of the ARGB format
 * specifies opacity; that is, <code>0x00RRGGBB</code> specifies a
 * fully transparent
 * pixel and <code>0xFFRRGGBB</code> specifies a fully opaque
 * pixel.  Intermediate
 * alpha values specify semitransparency.  If the implementation does not
 * support alpha blending for image rendering operations, it must remove
 * any semitransparency from the source data prior to performing any
 * rendering.  (See <a href="Image.html#alpha">Alpha Processing</a> for
 * further discussion.)
 * If <code>processAlpha</code> is <code>false</code>, the alpha
 * values are ignored and all pixels
 * must be treated as completely opaque.</p>
 *
 * <p> The mapping from ARGB values to the device-dependent
 * pixels is platform-specific and may require significant
 * computation.</p>
 *
 * @param rgbData an array of ARGB values in the format
 * <code>0xAARRGGBB</code>
 * @param offset the array index of the first ARGB value
 * @param scanlength the relative array offset between the
 * corresponding pixels in consecutive rows in the
 * <code>rgbData</code> array
 * @param x the horizontal location of the region to be rendered
 * @param y the vertical location of the region to be rendered
 * @param width the width of the region to be rendered
 * @param height the height of the region to be rendered
 * @param processAlpha <code>true</code> if <code>rgbData</code>
 * has an alpha channel,
 * false if all pixels are fully opaque
 *
 * @throws ArrayIndexOutOfBoundsException if the requested operation
 * will attempt to access an element of <code>rgbData</code>
 * whose index is either negative or beyond its length
 * @throws NullPointerException if <code>rgbData</code> is <code>null</code>
 *
 */
Graphics.prototype.drawRGB = function(rgbData, offset, scanlength, x, y, width, height, processAlpha) {
	if (this.context == null) {
		return;
	}
	
	var datatype = typeof rgbData[0];
	if (datatype == 'undefined') {
		return;
	}

	x += this.tx;
	y += this.ty;

    var sx = 0, sy = 0;
    
	if ((x + width) <= this.getClipX()
			|| (y + height) <= this.getClipY()
			|| x >= (this.getClipX() + this.getClipWidth())
			|| y >= (this.getClipY() + this.getClipHeight())) {
			// Not visible
			return;
		}

	var dx = this.getClipX() - x;		// int
	if (dx > 0) {
		sx = dx;
		width -= dx;
		x = this.getClipX();
	}
	var dy = this.getClipY() - y;		// int
	if (dy > 0) {
		sy = dy;
		height -= dy;
		y = this.getClipY();
	}
	
	dx = (x + width) - (this.getClipX() + this.getClipWidth());
	if (dx > 0) {
		width -= dx;
	}

	dy = (y + height) - (this.getClipY() + this.getClipHeight());
	if (dy > 0) {
		height -= dy;
	}
	
	if (width <= 0 || height <= 0) {
		return;
	}

    var i, j, factor, factor1;
    var r, g, b, a, clr;
    var output 		= this.getImageData(this.context, x, y, width, height);
    var outputData 	= output.data;

    // copy pixels.
    if (processAlpha == true) {
	    for (var py = 0; py < height; py += 1) {
		      for (var px = 0; px < width; px += 1) {
		    	  i 	= (py * width + px) * 4;
		    	  j 	= (py + sy) * scanlength + (px + sx);
		    	  clr 	= MathUtils.toUInt(rgbData[j]);
		    	  
		    	  b 	= clr % 256; clr = (clr - b) / 256;
		    	  g 	= clr % 256; clr = (clr - g) / 256;
		    	  r 	= clr % 256;
		    	  a 	= (clr - r) / 256;
		    	  
	        	  factor  = a;
	        	  factor1 = 255 - a;
	    		  outputData[i] 	= MathUtils.toInt((r * factor + outputData[i] * factor1) / 255);
	    		  outputData[i + 1] = MathUtils.toInt((g * factor + outputData[i + 1] * factor1) / 255);
	    		  outputData[i + 2] = MathUtils.toInt((b * factor + outputData[i + 2] * factor1) / 255);
	    		  outputData[i + 3] = Math.max(a, outputData[i + 3]);
	    		  /*
	          	  outputData[i++] = (clr & 0x00FF0000) >> 16;
	        	  outputData[i++] = (clr & 0x0000FF00) >> 8;
	        	  outputData[i++] = (clr & 0x000000FF);*/		    	  
		      }
		    }
    }
    else {
	    for (var py = 0; py < height; py += 1) {
	      for (var px = 0; px < width; px += 1) {
	    	  i 	= (py * width + px) * 4;
	    	  j 	= (py + sy) * scanlength + (px + sx);
	    	  clr 	= MathUtils.toUInt(rgbData[j]);
	    	  /*b 	= clr % 256; clr = (clr - b) / 256;
	    	  g 	= clr % 256; clr = (clr - g) / 256;
	    	  r 	= clr % 256;*/
	    	  
          	  outputData[i++] = (clr & 0x00FF0000) >> 16;
        	  outputData[i++] = (clr & 0x0000FF00) >> 8;
        	  outputData[i++] = (clr & 0x000000FF);		
        	  outputData[i++] = 255;
	      }
	    }
    }

    // put the image data back after manipulation
    this.context.putImageData(output, x, y);	
};

/**
 * Draws the outline of the specified rounded corner rectangle
 * using the current color and stroke style.
 * The resulting rectangle will cover an area <code>(width +
 * 1)</code> pixels wide
 * by <code>(height + 1)</code> pixels tall.
 * If either <code>width</code> or <code>height</code> is less than
 * zero, nothing is drawn.
 * @param x the x coordinate of the rectangle to be drawn
 * @param y the y coordinate of the rectangle to be drawn
 * @param width the width of the rectangle to be drawn
 * @param height the height of the rectangle to be drawn
 * @param arcWidth the horizontal diameter of the arc at the four corners
 * @param arcHeight the vertical diameter of the arc at the four corners
 * @see #fillRoundRect(int, int, int, int, int, int)
 */
Graphics.prototype.drawRoundRect = function(x, y, width, height, arcWidth, arcHeight) {
	if (this.context == null) {
		return;
	}

	x += this.tx;
	y += this.ty;

	var dx = this.getClipX() - x;		// int
	if (dx > 0) {
		width -= dx;
		x = this.getClipX();
	}
	var dy = this.getClipY() - y;		// int
	if (dy > 0) {
		height -= dy;
		y = this.getClipY();
	}
	
	dx = (x + width) - (this.getClipX() + this.getClipWidth());
	if (dx > 0) {
		width -= dx;
	}

	dy = (y + height) - (this.getClipY() + this.getClipHeight());
	if (dy > 0) {
		height -= dy;
	}
	
	if (width <= 0 || height <= 0) {
		return;
	}	
	
	var radius = arcWidth;
	
	this.context.save();
	    this.context.beginPath();
		    this.context.moveTo(x + radius, y);
		    this.context.lineTo(x + width - radius, y);
		    this.context.quadraticCurveTo(x + width, y, x + width, y + radius);
		    this.context.lineTo(x + width, y + height - radius);
		    this.context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		    this.context.lineTo(x + radius, y + height);
		    this.context.quadraticCurveTo(x, y + height, x, y + height - radius);
		    this.context.lineTo(x, y + radius);
		    this.context.quadraticCurveTo(x, y, x + radius, y);
	    this.context.closePath();
	    
	    this.context.stroke();
	this.context.restore();
};

/**
 * Draws the specified <code>String</code> using the current font and color.
 * The <code>x,y</code> position is the position of the anchor point.
 * See <a href="#anchor">anchor points</a>.
 * @param str the <code>String</code> to be drawn
 * @param x the x coordinate of the anchor point
 * @param y the y coordinate of the anchor point
 * @param anchor the anchor point for positioning the text
 * @throws NullPointerException if <code>str</code> is <code>null</code>
 * @throws IllegalArgumentException if anchor is not a legal value
 * @see #drawChars(char[], int, int, int, int, int)
 */
Graphics.prototype.drawString = function(str, x, y, anchor) {
	if (this.context == null) {
		return;
	}

	x += this.tx;
	y += this.ty;
	
	this.context.save();
	
	// textAlign = "start", "end", "left", "right", "center" (default: "start")
	if (anchor & Graphics.LEFT) {
		this.context.textAlign = 'left';
	}
	else if (anchor & Graphics.HCENTER) {
		this.context.textAlign = 'center';
	}
	else if (anchor & Graphics.RIGHT) {
		this.context.textAlign = 'right';
	}
	else
		this.context.textAlign = 'left';
	
	var ly = y;
	
	// textBaseline = "top", "hanging", "middle", "alphabetic", "ideographic", "bottom" (default: "alphabetic")
	if (anchor & Graphics.TOP) {
		this.context.textBaseline = 'top';
		ly += this.font.getSize();
	}
	else if (anchor & Graphics.VCENTER) {
		this.context.textBaseline = 'middle';
		ly += this.font.getSize() / 2;
	}
	else if (anchor & Graphics.BOTTOM) {
		this.context.textBaseline = 'bottom';
	}
	else if (anchor & Graphics.BASELINE) {
		this.context.textBaseline = 'alphabetic';
		ly += this.font.getSize() - this.font.getBaselinePosition();
	}
	else
	{
		this.context.textBaseline = 'top';
		ly += this.font.getSize();
	}
	
	//this.context.globalCompositeOperation = 'xor';
	this.context.fillStyle 	 = this.font.getColor();
	this.context.strokeStyle = this.font.getColor();

	this.context.fillText(str, x, y);
	if (this.font.isUnderlined()) {
		this.drawLine(x, ly, x + this.context.measureText(str).width, ly);
	}
	
	this.context.restore();
};

/**
 * Draws the specified <code>String</code> using the current font and color.
 * The <code>x,y</code> position is the position of the anchor point.
 * See <a href="#anchor">anchor points</a>.
 *
 * <p>The <code>offset</code> and <code>len</code> parameters must
 * specify a valid range of characters within
 * the string <code>str</code>.
 * The <code>offset</code> parameter must be within the
 * range <code>[0..(str.length())]</code>, inclusive.
 * The <code>len</code> parameter
 * must be a non-negative integer such that
 * <code>(offset + len) &lt;= str.length()</code>.</p>
 *
 * @param str the <code>String</code> to be drawn
 * @param offset zero-based index of first character in the substring
 * @param len length of the substring
 * @param x the x coordinate of the anchor point
 * @param y the y coordinate of the anchor point
 * @param anchor the anchor point for positioning the text
 * @see #drawString(String, int, int, int).
 * @throws StringIndexOutOfBoundsException if <code>offset</code>
 * and <code>length</code> do not specify
 * a valid range within the <code>String</code> <code>str</code>
 * @throws IllegalArgumentException if <code>anchor</code>
 * is not a legal value
 * @throws NullPointerException if <code>str</code> is <code>null</code>
 */
Graphics.prototype.drawSubstring = function(str, offset, len, x, y, anchor) {
	this.drawString(str.substring(offset, offset + len), x, y, anchor);
};

/**
 * Draw triangle with specified vertexs
 */
Graphics.prototype.drawTriangle = function(x1, y1, x2, y2, x3, y3) {
	if (this.context == null) {
		return;
	}

	x1 += this.tx;
	y1 += this.ty;
	x2 += this.tx;
	y2 += this.ty;
	x3 += this.tx;
	y3 += this.ty;
	
	this.context.save();
		this.context.beginPath();
			this.context.moveTo(x1, y1);
			this.context.lineTo(x2, y2);
			this.context.lineTo(x3, y3);
		this.context.closePath();
		
		this.context.stroke();
	this.context.restore();
};

/**
 * Fills a circular or elliptical arc covering the specified rectangle.
 * <p>
 * The resulting arc begins at <code>startAngle</code> and extends
 * for <code>arcAngle</code> degrees.
 * Angles are interpreted such that <code>0</code> degrees
 * is at the <code>3</code> o'clock position.
 * A positive value indicates a counter-clockwise rotation
 * while a negative value indicates a clockwise rotation.
 * <p>
 * The center of the arc is the center of the rectangle whose origin
 * is (<em>x</em>,&nbsp;<em>y</em>) and whose size is specified by the
 * <code>width</code> and <code>height</code> arguments.
 * <p>
 * If either <code>width</code> or <code>height</code> is zero or less,
 * nothing is drawn.
 *
 * <p> The filled region consists of the &quot;pie wedge&quot;
 * region bounded
 * by the arc
 * segment as if drawn by <code>drawArc()</code>, the radius extending from
 * the center to
 * this arc at <code>startAngle</code> degrees, and radius extending
 * from the
 * center to this arc at <code>startAngle + arcAngle</code> degrees. </p>
 *
 * <p> The angles are specified relative to the non-square extents of
 * the bounding rectangle such that <code>45</code> degrees always
 * falls on the
 * line from the center of the ellipse to the upper right corner of
 * the bounding rectangle. As a result, if the bounding rectangle is
 * noticeably longer in one axis than the other, the angles to the
 * start and end of the arc segment will be skewed farther along the
 * longer axis of the bounds. </p>
 *
 * @param x the <em>x</em> coordinate of the upper-left corner of
 * the arc to be filled.
 * @param y the <em>y</em> coordinate of the upper-left corner of the
 * arc to be filled.
 * @param width the width of the arc to be filled
 * @param height the height of the arc to be filled
 * @param startAngle the beginning angle.
 * @param arcAngle the angular extent of the arc,
 * relative to the start angle.
 * @see #drawArc(int, int, int, int, int, int)
 */
Graphics.prototype.fillArc = function(x, y, width, height, startAngle, arcAngle) {
	if (this.context == null) {
		return;
	}

	x += this.tx;
	y += this.ty;

	this.context.save();
		this.context.beginPath();
			this.context.arc(x + width / 2, y + height / 2, width / 2, startAngle, startAngle + arcAngle, false);
		this.context.closePath();

		this.context.fill();
	this.context.restore();
};

/**
 * Fills the specified rectangle with the current color.
 * If either width or height is zero or less,
 * nothing is drawn.
 * @param x the x coordinate of the rectangle to be filled
 * @param y the y coordinate of the rectangle to be filled
 * @param width the width of the rectangle to be filled
 * @param height the height of the rectangle to be filled
 * @see #drawRect(int, int, int, int)
 */
Graphics.prototype.fillRect = function(x, y, width, height) {
	if (this.context == null) {
		return;
	}

	x += this.tx;
	y += this.ty;
	
	var dx = this.getClipX() - x;		// int
	if (dx > 0) {
		width -= dx;
		x = this.getClipX();
	}
	var dy = this.getClipY() - y;		// int
	if (dy > 0) {
		height -= dy;
		y = this.getClipY();
	}
	
	dx = (x + width) - (this.getClipX() + this.getClipWidth());
	if (dx > 0) {
		width -= dx;
	}

	dy = (y + height) - (this.getClipY() + this.getClipHeight());
	if (dy > 0) {
		height -= dy;
	}
	
	if (width <= 0 || height <= 0) {
		return;
	}
	
	this.context.save();
		this.context.fillRect(x, y, width, height);
	this.context.restore();
};

/**
 * Fills the specified rectangle with the gradient color.
 * If either width or height is zero or less,
 * nothing is drawn.
 * @param x the x coordinate of the rectangle to be filled
 * @param y the y coordinate of the rectangle to be filled
 * @param width the width of the rectangle to be filled
 * @param height the height of the rectangle to be filled
 * @param gx the x coordinate for the gradient
 * @param gy the y coordinate for the graidient
 * @param gw the width for the gradient
 * @param gh the height for the gradient
 * @param clr1 the first color for gradient (ex. "#FF0000")
 * @param clr2 the second color for gradient (ex. "#FF0000")
 * @see #drawRect(int, int, int, int)
 */
Graphics.prototype.fillGradientRect = function(x, y, width, height, gx, gy, gw, gh, clr1, clr2) {
	if (this.context == null) {
		return;
	}

	x += this.tx;
	y += this.ty;
	
	var dx = this.getClipX() - x;		// int
	if (dx > 0) {
		width -= dx;
		x = this.getClipX();
	}
	var dy = this.getClipY() - y;		// int
	if (dy > 0) {
		height -= dy;
		y = this.getClipY();
	}
	
	dx = (x + width) - (this.getClipX() + this.getClipWidth());
	if (dx > 0) {
		width -= dx;
	}

	dy = (y + height) - (this.getClipY() + this.getClipHeight());
	if (dy > 0) {
		height -= dy;
	}
	
	if (width <= 0 || height <= 0) {
		return;
	}

	var	oldFillStyle = this.context.fillStyle;
	
	var grdObject = this.context.createLinearGradient(x + gx, y + gy, x + gx + gw, y + gy + gh);
	grdObject.addColorStop(0, Color.colorToString(clr1));
	grdObject.addColorStop(1, Color.colorToString(clr2));
	
	this.context.fillStyle = grdObject;
	this.context.fillRect(x, y, width, height);
	
	this.context.fillStyle = oldFillStyle;
};

/**
 * Fills the specified rounded corner rectangle with the current color.
 * If either <code>width</code> or <code>height</code> is zero or less,
 * nothing is drawn.
 * @param x the x coordinate of the rectangle to be filled
 * @param y the y coordinate of the rectangle to be filled
 * @param width the width of the rectangle to be filled
 * @param height the height of the rectangle to be filled
 * @param arcWidth the horizontal diameter of the arc at the four
 * corners
 * @param arcHeight the vertical diameter of the arc at the four corners
 * @see #drawRoundRect(int, int, int, int, int, int)
 */
Graphics.prototype.fillRoundRect = function(x, y, width, height, arcWidth, arcHeight) {
	if (this.context == null) {
		return;
	}

	x += this.tx;
	y += this.ty;
	
	var dx = this.getClipX() - x;		// int
	if (dx > 0) {
		width -= dx;
		x = this.getClipX();
	}
	var dy = this.getClipY() - y;		// int
	if (dy > 0) {
		height -= dy;
		y = this.getClipY();
	}
	
	dx = (x + width) - (this.getClipX() + this.getClipWidth());
	if (dx > 0) {
		width -= dx;
	}

	dy = (y + height) - (this.getClipY() + this.getClipHeight());
	if (dy > 0) {
		height -= dy;
	}
	
	if (width <= 0 || height <= 0) {
		return;
	}
	
	var radius = arcWidth;
	
	this.context.save();
	    this.context.beginPath();
		    this.context.moveTo(x + radius, y);
		    this.context.lineTo(x + width - radius, y);
		    this.context.quadraticCurveTo(x + width, y, x + width, y + radius);
		    this.context.lineTo(x + width, y + height - radius);
		    this.context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		    this.context.lineTo(x + radius, y + height);
		    this.context.quadraticCurveTo(x, y + height, x, y + height - radius);
		    this.context.lineTo(x, y + radius);
		    this.context.quadraticCurveTo(x, y, x + radius, y);
	    this.context.closePath();
	    
	    this.context.fill();
	this.context.restore();
};

/**
 * Fills the specified triangle will the current color.  The lines
 * connecting each pair of points are included in the filled
 * triangle.
 *
 * @param x1 the x coordinate of the first vertex of the triangle
 * @param y1 the y coordinate of the first vertex of the triangle
 * @param x2 the x coordinate of the second vertex of the triangle
 * @param y2 the y coordinate of the second vertex of the triangle
 * @param x3 the x coordinate of the third vertex of the triangle
 * @param y3 the y coordinate of the third vertex of the triangle
 *
 * @since MIDP 2.0
 */
Graphics.prototype.fillTriangle = function(x1, y1, x2, y2, x3, y3) {
	if (this.context == null) {
		return;
	}

	x1 += this.tx;
	y1 += this.ty;
	x2 += this.tx;
	y2 += this.ty;
	x3 += this.tx;
	y3 += this.ty;
	
	this.context.save();
		this.context.beginPath();
			this.context.moveTo(x1, y1);
			this.context.lineTo(x2, y2);
			this.context.lineTo(x3, y3);
		this.context.closePath();
		
		this.context.fill();
	this.context.restore();
};

/**
 * Fills the specified triangle will the current color.  The lines
 * connecting each pair of points are included in the filled
 * triangle.
 *
 * @param x1 the x coordinate of the first vertex of the triangle
 * @param y1 the y coordinate of the first vertex of the triangle
 * @param x2 the x coordinate of the second vertex of the triangle
 * @param y2 the y coordinate of the second vertex of the triangle
 * @param x3 the x coordinate of the third vertex of the triangle
 * @param y3 the y coordinate of the third vertex of the triangle
 *
 * @since MIDP 2.0
 */
Graphics.prototype.fillPath = function(points) {
	if (this.context == null) {
		return;
	}
	
	var i = 0;
	var pp = [];
	
	for (i = 0; i < points.length; i += 2) {
		pp[i] = points[i] + this.tx;
		pp[i + 1] = points[i + 1] + this.ty;
	}
	
	this.context.save();
		this.context.beginPath();
			this.context.moveTo(pp[0], pp[1]);
			for (i = 2; i < pp.length; i += 2)
				this.context.lineTo(pp[i], pp[i + 1]);
		this.context.closePath();
		
		this.context.fill();
	this.context.restore();
};

/**
 * return alpha component of current selected color
 */
Graphics.prototype.getAlphaComponent = function() {
	return this.colorA;
};

/**
 * return blue component of current selected color
 */
Graphics.prototype.getBlueComponent = function() {
	return this.colorB;
};

/**
 * Gets the height of the current clipping area.
 * @return height of the current clipping area.
 * @see #clipRect(int, int, int, int)
 * @see #setClip(int, int, int, int)
 */
Graphics.prototype.getClipHeight = function() {
	return this.clipHeight;
};

/**
 * Gets the width of the current clipping area.
 * @return width of the current clipping area.
 * @see #clipRect(int, int, int, int)
 * @see #setClip(int, int, int, int)
 */
Graphics.prototype.getClipWidth = function() {
	return this.clipWidth;
};

/**
 * Get the x coordinate of the clip
 *
 * @return int The x coordinate of the clip
 */
Graphics.prototype.getClipX = function() {
	return this.clipX + this.tx;
};

/**
 * Get the y coordinate of the clip
 *
 * @return int The y coordinate of the clip
 */
Graphics.prototype.getClipY = function() {
	return this.clipY + this.ty;
};

/**
 * Gets the current color.
 * @return an integer in form <code>0x00RRGGBB</code>
 * @see #setColor(int, int, int)
 */
Graphics.prototype.getColor = function() {
	return this.color;
};

/**
 * Gets the current fill color.
 * @return an integer in form <code>0x00RRGGBB</code>
 */
Graphics.prototype.getFillColor = function() {
	return this.fillColor;
};

/**
 * Gets the current stroke color.
 * @return an integer in form <code>0x00RRGGBB</code>
 */
Graphics.prototype.getStrokeColor = function() {
	return this.strokeColor;
};

/**
 * Gets the current font.
 * @return current font
 * @see #setFont(Font)
 */
Graphics.prototype.getFont = function() {
	return this.font;
};

/**
 * Gets the current grayscale value of the color being used for rendering
 * operations. If the color was set by
 * <code>setGrayScale()</code>, that value is simply
 * returned. If the color was set by one of the methods that allows setting
 * of the red, green, and blue components, the value returned is 
 * computed from
 * the RGB color components (possibly in a device-specific fashion)
 * that best
 * approximates the brightness of that color.
 *
 * @return integer value in range <code>0-255</code>
 * @see #setGrayScale
 */
Graphics.prototype.getGrayScale = function() {
	return this.grayScale;
};

/**
 * Gets the green component of the current color.
 * @return integer value in range <code>0-255</code>
 * @see #setColor(int, int, int)
 */
Graphics.prototype.getGreenComponent = function() {
	return this.colorG;
};

/**
 * Gets the red component of the current color.
 * @return integer value in range <code>0-255</code>
 * @see #setColor(int, int, int)
 */
Graphics.prototype.getRedComponent = function() {
	return this.colorR;
};

/**
 * Gets the stroke size
 */
Graphics.prototype.getStrokeSize = function() {
	if (this.context == null) {
		return 0;
	}

	return this.context.lineWidth;
};

/**
 * Gets the stroke style
 */
Graphics.prototype.getStrokeStyle = function() {
	return this.strokeStyle;
};

/**
 * Gets the X coordinate of the translated origin of this graphics context.
 * @return X of current origin
 */
Graphics.prototype.getTranslateX = function() {
	return this.tx;
};

/**
 * Gets the Y coordinate of the translated origin of this graphics context.
 * @return Y of current origin
 */
Graphics.prototype.getTranslateY = function() {
	return this.ty;
};

/**
 * Sets the current clip to the rectangle specified by the
 * given coordinates.
 * Rendering operations have no effect outside of the clipping area.
 * @param x the x coordinate of the new clip rectangle
 * @param y the y coordinate of the new clip rectangle
 * @param width the width of the new clip rectangle
 * @param height the height of the new clip rectangle
 * @see #clipRect(int, int, int, int)
 */
Graphics.prototype.setClip = function(x, y, width, height) {
	this.clipX 		= x;
	this.clipY		= y;
	this.clipWidth	= width;
	this.clipHeight	= height;
};

/**
 * get context object.
*/
Graphics.prototype.getContext = function() {
	return this.context;
};

/**
 * set context with specified value
 */
Graphics.prototype.setContext = function(context) {
	this.context = context;
	if (this.context != null) {
		this.context.globalCompositeOperation = 'source-over';
	}
};

/**
 * set alpha component of this current color
 */
Graphics.prototype.setAlpha = function(alpha) {
	if (this.context != null) {
		this.colorA = alpha;
		this.context.fillStyle 	 = 'rgba(' + this.colorR + ',' + this.colorG + ',' + this.colorB + ',' + this.colorA / 255 + ')';
		this.context.strokeStyle = 'rgba(' + this.colorR + ',' + this.colorG + ',' + this.colorB + ',' + this.colorA / 255 + ')';
	}
};

Graphics.prototype.setGlobalAlpha = function(alpha) {
	if (this.context != null) {
		this.context.globalAlpha = alpha / 255;
	}
};

/**
 * Set the Color of this Graphics context
 *
 * @param red The Red color component
 * @param green The Green color component
 * @param blue The Blue color component
 * @see #getColor
 */
Graphics.prototype.setColor = function(r, g, b, a) {
    switch (arguments.length) {
    case 1:
    	if (typeof r == "string") {
			if (this.context != null) {
				this.context.fillStyle 	 = r;
				this.context.strokeStyle = r;
				
				if (this.font != null)
					this.font.setColor(r);
			}
			
			return;
    	}
    	else {
			this.color 	= MathUtils.toUInt(r);
			this.colorR = Color.getRedComponent(r);
			this.colorG = Color.getGreenComponent(r);
			this.colorB = Color.getBlueComponent(r);
			this.colorA = 255;
	
			if (this.context != null) {
				this.context.fillStyle 	 = 'rgba(' + this.colorR + ',' + this.colorG + ',' +this.colorB + ',' + this.colorA / 255 + ')';
				this.context.strokeStyle = 'rgba(' + this.colorR + ',' + this.colorG + ',' +this.colorB + ',' + this.colorA / 255 + ')';
			}
		}
        
        break;
        
    case 3:
	case 4:
        if (arguments.length == 3)
    		this.colorA = 255;
        else
	    	this.colorA = a;

		this.color 	= r * 256 * 256 + g * 256 + b;
		this.colorR = r;
		this.colorG = g;
		this.colorB = b;
	
		if (this.context != null) {
			this.context.fillStyle 	 = 'rgba(' + r + ',' + g + ',' + b + ',' + this.colorA / 255 + ')';
			this.context.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + this.colorA / 255 + ')';
		}
		break;
	}
			
	if (this.font != null)
		this.font.setColor(this.colorR, this.colorG, this.colorB, this.colorA);
};

/**
 * set fill color of this graphic context
 */
Graphics.prototype.setFillColor = function(r, g, b, a) {
	if (g == undefined || b == undefined) {
		this.fillColor = r;
	}
	else {
		this.fillColor = r * 256 * 256 + g * 256 + b;
	}
	
	if (a == undefined) {
		if (this.context != null) {
			this.context.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',1)';
		}
	}
	else {
		if (this.context != null) {
			this.context.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a / 255 + ')';
		}
	}
};

/**
 * set stroke color of this graphic context
 */
Graphics.prototype.setStrokeColor = function(r, g, b, a) {
	if (g == undefined || b == undefined) {
		this.strokeColor = MathUtils.toUInt(r);
	}
	else {
		this.strokeColor = r * 256 * 256 + g * 256 + b;
	}
	
	this.color 	= this.strokeColor;
	this.colorR = Color.getRedComponent(this.color);
	this.colorG = Color.getGreenComponent(this.color);
	this.colorB = Color.getBlueComponent(this.color);
	
	if (a == undefined) {
		this.colorA = 255;
		if (this.context != null) {
			this.context.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',1)';
		}
	}
	else {
		this.colorA = a;
		if (this.context != null) {
			this.context.strokeStyle = 'rgba(' + r + ',' + g + ',' + a / 255 + ')';
		}
	}
};

/**
 * set font color of this graphic context
 */
Graphics.prototype.setFont = function(font) {
	this.font = font;
	
	if (this.context != null) {
		this.context.font = font.getSize() + 'px ' + font.getFamilyName();
		if (font.isBold()) {
			this.context.font += ' bold';
		}
		if (font.isItalic()) {
			this.context.font += ' italic';
		}
	}
};

Graphics.prototype.setFontSize = function(size) {
	if (this.font == null)
		return;
	
	this.font.setSize(size);
	this.setFont(this.font);
}

Graphics.prototype.setFontFamily = function(family) {
	if (this.font == null)
		return;
	
	this.font.setFamilyName(family);
	this.setFont(this.font);
}

/**
 * Set the gray scale value of this Graphics context
 *
 * @param value The gray scale value
 */
Graphics.prototype.setGrayScale = function(value) {
	this.grayScale = value;
};

/**
 * set stroke size of this graphic context
 */
Graphics.prototype.setStrokeSize = function(size) {
	if (this.context == null) {
		return;
	}
	
	this.context.lineWidth = size;
};

/**
 * set stroke style of this graphic context
 */
Graphics.prototype.setStrokeStyle = function(style) {
	this.strokeStyle = style;
};

/**
 * translate relative coordinate to real coordinate
 */
Graphics.prototype.translate = function(x, y) {
	this.tx += x;
	this.ty += y;
};

/**
 * save graphics context
 */
Graphics.prototype.save = function() {
	if (this.context == null) {
		return;
	}
	
	this.context.save();
	this.clipSave();
};

/**
 * restore graphics context
 */
Graphics.prototype.restore = function() {
	if (this.context == null) {
		return;
	}
	
	this.clipRestore();
	this.context.restore();
};

/**
 * return the width of string by this graphic context
 */
Graphics.prototype.stringWidth = function(str) {
	if (this.context == null) {
		return 0;
	}
	
	return this.context.measureText(str).width;
};

/**
 * return image data by specified area
 */
Graphics.prototype.getImageData = function(context, x, y, w, h) {
	try	{
		return context.getImageData(x, y, w, h);
	}
	catch (err) {
		Debugger.exceptionCaught(err, "getImageData security exception");
	}
};
