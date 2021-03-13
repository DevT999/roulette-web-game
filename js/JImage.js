
JImage = function() {
	this.context 	= null;
	this.image 		= null;
	this.graphics	= new Graphics(null);
	this.isLoaded	= false;
	this.mutable	= true;
	this.width		= 0;
	this.height		= 0;
	
	this.transparent = 0;
	this.idx 		= -1;
	this.imgIndex	= -1;
	/*
	if (JImage.imgs == null)
		JImage.imgs	= new_array(1, null, JImage.imgMaxCount + 1);
	
	if (JImage.imgIndices == null)
		JImage.imgIndices	= new_array(1, -1, JImage.imgMaxCount + 1);
	
	if (JImage.imgLoadStates == null)
		JImage.imgLoadStates = new_array(1, false, JImage.imgMaxCount + 1);
	
	if (JImage.imgLoadStatesByIndex == null)
		JImage.imgLoadStatesByIndex = new_array(1, false, JImage.imgMaxCount + 1);
		*/
};

JImage.createCount = 0;
JImage.loadedCount = 0;

JImage.BASE64CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

JImage.buf = null;
JImage.ch1 = -1;
JImage.ch2 = -1;
JImage.ch3 = -1;
JImage.BUFSPLITLEN = 1000;

JImage.imgMaxCount		 	= 810;
JImage.imgs 				= null;
JImage.imgIndices 			= null;
JImage.imgLoadStates 		= null;
JImage.imgLoadStatesByIndex = null;

JImage.reloading = false;

JImage.reload = function(arrIDs, d)
{
	var count = 0;
	var fileName = -1;
	if (!goog.isDef(arrIDs))
	{
		for (var i = 0; i < JImage.createCount; i++)
		{
			if (JImage.imgs[i] != null)
			{
				if (JImage.imgLoadStates[i] == false)
				{
					JImage.imgs[i].image.src = "";
					JImage.imgs[i].image.src = "res/" + JImage.imgs[i].imgIndex + ".png";
					fileName = JImage.imgs[i].imgIndex;
					count++;
				}
			}
		}
	}
	else
	{
		if (d == 1)
		{
			for (var i = 0; i < arrIDs.length; i++)
			{
				if (JImage.imgLoadStatesByIndex[arrIDs[i]] == false)
				{
					var idx = JImage.imgIndices[arrIDs[i]];
					if (idx >= 0 && JImage.imgs[idx] != null)
					{
						JImage.imgs[idx].image.src = "";
						JImage.imgs[idx].image.src = "res/" + JImage.imgs[idx].imgIndex + ".png";
						fileName = JImage.imgs[idx].imgIndex;
						count++;
					}
				}
			}
		}
		else
		{
			for (var i = 0; i < arrIDs.length; i += 2)
			{
				for (var j = arrIDs[i]; j <= arrIDs[i + 1]; j++)
				{
					if (JImage.imgLoadStatesByIndex[j] == false)
					{
						var idx = JImage.imgIndices[j];
						if (idx >= 0 && JImage.imgs[idx] != null)
						{
							JImage.imgs[idx].image.src = "";
							JImage.imgs[idx].image.src = "res/" + JImage.imgs[idx].imgIndex + ".png";
							fileName = JImage.imgs[idx].imgIndex;
							count++;
						}
					}
				}
			}
		}
	}
	
	//alert('reload count = ' + count);
	//alert('fileName = ' + fileName);
};

JImage.decodeResource = function(src) {
	var img = new JImage();
	img.createImage_org("img/" + src + ".png");
	
	return img;
};

/**
 * Creates Image
 *
 * @param name the name of the resource containing the image data in one of
 * the supported image formats
 * @param x left of the image
 * @param y top of the image
 * @param width width of the image
 * @param height height of the image
 * @param transform transform type of image
 * @return the created image
 */

// static Image createImage(Image source)
// static Image createImage(String name)
// static Image createImage(int width, int height)
// static Image createImage(byte[] imageData, int imageOffset, int imageLength)
JImage.createImage = function(name, x, y, width, height, transform) {
	var img = new JImage();
	img.createImage_org(name, x, y, width, height, transform);
	
	return img;
};

/**
 * Creates Image
 *
 * @param name the name of the resource containing the image data in one of
 * the supported image formats
 * @param x left of the image
 * @param y top of the image
 * @param width width of the image
 * @param height height of the image
 * @param transform transform type of image
 * @return the created image
 */
JImage.prototype.createImage_org = function(name, x, y, width, height, transform) {
	if (this.context != null) {
		return;
	}
	
	if (arguments.length == 1) {		// String name
//		console.warn('Image Index : ' + x);
		this.image 			= new Image();
		this.idx			= JImage.createCount;
		this.imgIndex		= x;
			
		//JImage.imgs[JImage.createCount] = this;
		JImage.createCount++;
		
		//if (x < JImage.imgMaxCount)
		//	JImage.imgIndices[x] = JImage.createCount;
		
		//this.width			= ResourceSizes.data[x][0];
		//this.height			= ResourceSizes.data[x][1];
		this.image.src 		= name;
		this.image.parent = this;
		this.image.onload 	= function() {
			var parent = this.parent;
						parent.isLoaded = true;
			
			JImage.loadedCount++;
			//JImage.imgLoadStates[this.idx] = true;
			
			//if (this.imgIndex < JImage.imgMaxCount)
			//	JImage.imgLoadStatesByIndex[this.imgIndex] = true;
			
			if (parent.image == null) {
				return;
			}
			
			if (parent.transparent == 0)
				parent.transparent = 1;
			
			parent.width = parent.image.width;
			parent.height = parent.image.height;
			
			//var canvas = goog.dom.createDom("canvas");
			var canvas = document.createElement('canvas');
			
			canvas.width	= parent.image.width;
			canvas.height 	= parent.image.height;
			parent.context 	= canvas.getContext("2d");
			parent.context.clearRect(0, 0, canvas.width, canvas.height);

			parent.graphics.setContext(parent.context);
			parent.graphics.setClip(0, 0, canvas.width, canvas.height);
			
			parent.context.globalCompositeOperation = 'source-over';
			parent.context.drawImage(parent.image, 0, 0);
		};
	}
	/*
	else if (goog.isString(name[0])) {
		this.width  = x * 2;
		this.height = y * 2;
		
		this.image 			= new Image();
		this.image.onload 	= goog.bind(this.onLoaded, this);
//        console.log("bs64PNG['" + width + "']=" +"'" + name[0] + "';");
		this.image.src = name[0];
	}
	else if (!goog.isDef(x)) {		// Image Source
		this.image 			= new Image();
		this.image.src 		= name.image.src;
		this.image.onload 	= goog.bind(this.onLoaded, this); 
	}
	else if (!goog.isDef(y)) {			// int width, int height
		
		var canvas = goog.dom.createDom("canvas");
		
		canvas.width	= name;
		canvas.height 	= x;
		this.context 	= canvas.getContext("2d");
		this.context.clearRect(0, 0, name, x);
		
		this.graphics.setContext(this.context);
		this.graphics.setClip(0, 0, name, x);
		this.graphics.clear();
	}
	else if (!goog.isDef(width)) {
		var strContent = '';
		if (!goog.isDef(name.handle)) {
			for (var i = x; i < x + y; i++) {
				strContent += String.fromCharCode(MathUtils.toUByte(name[i]));
			}
			strContent = JImage.binaryToBase64(strContent);
			this.width = MathUtils.toUByte(name[x + 16]) * 256 * 256 * 256 + MathUtils.toUByte(name[x + 17]) * 256 * 256 + MathUtils.toUByte(name[x + 18]) * 256 + MathUtils.toUByte(name[x + 19]);
			this.height = MathUtils.toUByte(name[x + 20]) * 256 * 256 * 256 + MathUtils.toUByte(name[x + 21]) * 256 * 256 + MathUtils.toUByte(name[x + 22]) * 256 + MathUtils.toUByte(name[x + 23]);
		}
		else {
			strContent = JImage.binaryToBase64(name.handle, x, y);
			name.pos = x + 16;
			this.width = name.read() * 256 * 256 * 256 + name.read() * 256 * 256 + name.read() * 256 + name.read();
			this.height = name.read() * 256 * 256 * 256 + name.read() * 256 * 256 + name.read() * 256 + name.read();
		}
		strContent = 'data:image/png;base64,' + strContent;
		this.image 			= new Image();
		this.image.onload 	= goog.bind(this.onLoaded, this);
		this.image.src = strContent;
	}
	else {
		
	}
	*/
};

/**
 * Creates Image
 *
 * @param rgb rgb-block
 * @param width width of the image
 * @param height height of the image
 * @param processAlpha if alpha layer is applied
 * @param transform palette palette of image
 * @param paletteType palette type of image
 * @return the created image
 */
// static Image createRGBImage(int[] rgb, int width, int height, boolean processAlpha)
JImage.createRGBImage = function(rgb, width, height, processAlpha, palette, paletteType) {
	var img = new JImage();
	img.createRGBImage_org(rgb, width, height, processAlpha, palette, paletteType);
	
	return img;
};

JImage.createRGBImage_wac = function(palette, pixels, w, h, paletteType, pixelStartOffset, scale) {
	var img = new JImage();
	img.createRGBImage_wac_org(palette, pixels, w, h, paletteType, pixelStartOffset, scale);
	
	return img;
};
/**
 Get base64 formed inline image string
 * @param value value to be formated
 * @param digit number of digit
 * @return base64 formed string    
*/
JImage.prototype.getFormatString = function(value, digit) {
	var i = 0, j = 0;
	var str = '';
	for (i = 0; i < digit; i++) {
		j = value % 256;
		str += String.fromCharCode(j);
		value = MathUtils.toInt(value / 256);
	}
	
	return str;
};

/** 
 Get string of BMP ImageHeader
 * @param width
 * @param height
*/
JImage.prototype.getImageHeaderString = function(width, height) {
	var str = '';
	
	/////////////////////////////////////////////////////////////
	// BITMAPFILEHEADER data
	/////////////////////////////////////////////////////////////
	
	// WORD bfType
	str += 'BM';
	
	// DWORD bfSize
	str += this.getFormatString(14 + 40 + width * height * 4, 4);
	
	// WORD bfReserved1
	str += this.getFormatString(0, 2);
	
	// WORD bfReserved2
	str += this.getFormatString(0, 2);
	
	// DWORD bfOffBits
	str += this.getFormatString(14 + 40, 4);
	
	/////////////////////////////////////////////////////////////
	// BITMAPINFOHEADER data
	/////////////////////////////////////////////////////////////
	
	// DWORD biSize
	str += this.getFormatString(40, 4);
	
	// LONG biWidth
	str += this.getFormatString(width, 4);
	
	// LONG biHeight
	str += this.getFormatString(height, 4);
	
	// WORD biPlanes
	str += this.getFormatString(1, 2);
	
	// WORD biBitCount
	str += this.getFormatString(32, 2);
	
	// DWORD biCompression
	str += this.getFormatString(0, 4);
	
	// DWORD biSizeImage
	str += this.getFormatString(width * height * 4, 4);
	
	// LONG biXPelsPerMeter
	str += this.getFormatString(2834, 4);
	
	// LONG biYPelsPerMeter
	str += this.getFormatString(2834, 4);
	
	// DWORD biClrUsed
	str += this.getFormatString(0, 4);
	
	// DWORD biClrImportant
	str += this.getFormatString(0, 4);
	
	return str;
};

/**
 * Creates Image
 *
 * @param rgb rgb-block
 * @param width width of the image
 * @param height height of the image
 * @param processAlpha if alpha layer is applied
 * @param transform palette palette of image
 * @param paletteType palette type of image
 * @return the created image
 */
JImage.prototype.createRGBImage_org = function(rgb, width, height, processAlpha, palette, paletteType) {
	if (this.context != null) {
		return;
	}
	
	
	//var strContent = '';
	//strContent += this.getImageHeaderString(width, height);
	//for (var i = 0; i < width * height * 4; i++) {
	//	strContent += String.fromCharCode(rgb[i]);
	//}

    var i, j, px, py;
    var r, g, b, a, clr;
/*
	if (!goog.isDef(palette)) {
		for (var y = height; --y >= 0;)
		{
			out = y * width;
            for (var x = width; --x >= 0;)
            {
	            clr = MathUtils.toUInt(rgb[out++]);
	        	strContent += String.fromCharCode((clr & 0x000000FF));
	        	strContent += String.fromCharCode((clr & 0x0000FF00) >> 8);
	        	strContent += String.fromCharCode((clr & 0x00FF0000) >> 16);
	        	a = MathUtils.toUByte(clr / 256 / 256 / 256);
	        	strContent += String.fromCharCode(a);
	        	if (a < 255)
	        		this.transparent = 2;
	        }
        }
	}
	else {
		var out = 0;
		var stpos = rgb.pos;
		
		if (paletteType == DavinciUtilities.PIXELS_INDEXED) {
			for (var y = height; --y >= 0;)
			{
				out = y * width;
				rgb.pos = stpos + out;
	            for (var x = width; --x >= 0;)
	            {
	                // data[out++] = palette[pixels[offset++] & 0xFF]; // index
	            	//clr = MathUtils.toUInt(palette[pixels[offset++] & 0xFF]);
	            	clr = MathUtils.toUInt(palette[rgb.read()]);
	            	b = clr % 256; clr = (clr - b) / 256;
	            	g = clr % 256; clr = (clr - g) / 256;
	            	r = clr % 256; a = (clr - r) / 256;
	            	strContent += String.fromCharCode(b);
	            	strContent += String.fromCharCode(g);
	            	strContent += String.fromCharCode(r);
	            	strContent += String.fromCharCode(a);
	            	
	            	//strContent += String.fromCharCode((clr & 0x000000FF));
	            	//strContent += String.fromCharCode((clr & 0x0000FF00) >> 8);
	            	//strContent += String.fromCharCode((clr & 0x00FF0000) >> 16);
	            	//a = MathUtils.toUByte(clr / 256 / 256 / 256);
	            	//strContent += String.fromCharCode(a);
	            	
	            	if (a < 255)
	            		this.transparent = 2;
	            }
			}
		}
		else if (paletteType == DavinciUtilities.PIXELS_32BIT) {
			for (var y = height; --y >= 0;)
			{
				out = y * width * 4;
				rgb.pos = stpos + out;
	            for (var x = width; --x >= 0;)
	            {
	            	r = rgb.read();
	            	g = rgb.read();
	            	b = rgb.read();
	            	a = rgb.read();
	            	strContent += String.fromCharCode(b);
	            	strContent += String.fromCharCode(g);
	            	strContent += String.fromCharCode(r);
	            	strContent += String.fromCharCode(a);
	            	if (a < 255)
	            		this.transparent = 2;
	            }
			}
		}
		else {
			this.transparent = 1;
			for (var y = height; --y >= 0;)
			{
				out = y * width * 3;
				rgb.pos = stpos + out;
	            for (var x = width; --x >= 0;)
	            {
	            	r = rgb.read();
	            	g = rgb.read();
	            	b = rgb.read();
	            	strContent += String.fromCharCode(b);
	            	strContent += String.fromCharCode(g);
	            	strContent += String.fromCharCode(r);
	            	strContent += String.fromCharCode(255);
	            }
			}
		}
	}
	
	this.width = width;
	this.height = height;
	strContent = JImage.binaryToBase64(strContent);
	strContent = 'data:image/bmp;base64,' + strContent;
	this.image 			= new Image();
	this.image.onload 	= goog.bind(this.onLoaded, this);
	this.image.src 		= strContent;
*/
	var canvas = goog.dom.createDom("canvas");
	
	canvas.width	= width;
	canvas.height 	= height;
	this.context 	= canvas.getContext("2d");
	this.context.clearRect(0, 0, width, height);
	this.graphics.setContext(this.context);
	
    var i, j, px, py;
    var r, g, b, a, clr;
    var output 		= this.context.getImageData(0, 0, width, height);
    var outputData 	= output.data;

	if (!goog.isDef(palette)) {
	    // copy pixels.
	    for (py = 0; py < height; py += 1) {
	      for (px = 0; px < width; px += 1) {
	    	  i 	= (py * width + px) * 4;
	    	  j 	= py * width + px;
	    	  clr 	= MathUtils.toUInt(rgb[j]);
	    	  
          	  outputData[i++] = (clr & 0x00FF0000) >>> 16;
        	  outputData[i++] = (clr & 0x0000FF00) >>> 8;
        	  outputData[i++] = (clr & 0x000000FF);
	    	  if (processAlpha == false)
	    		  outputData[i++] = 255;
	    	  else
//	    		  outputData[i++] = MathUtils.toUByte((clr & 0xFF000000) >> 24);
	    		  outputData[i++] = clr >>> 24;
	      }
	    }
	}
	else {

	            			var out = 0;
		if (paletteType == DavinciUtilities.PIXELS_INDEXED) {
			this.graphics.setColor(0, 0, 0, 255);
			this.graphics.fillRect(0, 0, width, height);
			for (var y = height; --y >= 0;)
			{
				//out = y * width * 4;
	            for (var x = width; --x >= 0;)
	            {
	                // data[out++] = palette[pixels[offset++] & 0xFF]; // index
	            	//clr = MathUtils.toUInt(palette[pixels[offset++] & 0xFF]);
	            	clr = MathUtils.toUInt(palette[rgb.read()]);
	            	
	            	a = MathUtils.toUByte((clr & 0xFF000000) / (1 << 24));
	            	r = MathUtils.toUByte((clr & 0x00FF0000) / (1 << 16));
	            	g = MathUtils.toUByte((clr & 0x0000FF00) / (1 << 8));
	            	b = MathUtils.toUByte(clr & 0x000000FF);
	            	outputData[out] = MathUtils.toUByte((a * r + outputData[out] * (255 - a)) / 255);
	            	outputData[out + 1] = MathUtils.toUByte((a * g + outputData[out] * (255 - a)) / 255);
	            	outputData[out + 2] = MathUtils.toUByte((a * b + outputData[out] * (255 - a)) / 255);
	            	outputData[out + 3] = Math.max(a, outputData[out + 3]);
	            	out += 4;
	            }
			}
		}
		else if (paletteType == DavinciUtilities.PIXELS_32BIT) {
			for (var y = height; --y >= 0;)
			{
				//out = y * width * 4;
	            for (var x = width; --x >= 0;)
	            {
	                r = outputData[out++] = rgb.read();
	                g = outputData[out++] = rgb.read();
	                b = outputData[out++] = rgb.read();
	                a = MathUtils.toUByte(rgb.read());
	            	//if (a < 255)
	            	//	a = 0;
                	outputData[out++] = a;
	            }
			}
		}
		else {
			for (var y = height; --y >= 0;)
			{
				//out = y * width * 4;
	            for (var x = width; --x >= 0;)
	            {
	                r = outputData[out++] = rgb.read();
	                g = outputData[out++] = rgb.read();
	                b = outputData[out++] = rgb.read();
                	outputData[out++] = 255;
	            }
			}
		}
	}
	
    // put the image data back after manipulation
    this.context.putImageData(output, 0, 0);	
};

JImage.prototype.createRGBImage_wac_org = function(palette, pixels, w, h, paletteType, pixelStartOffset, scale) {
	if (this.context != null) {
		return;
	}
    
 	var origWidth = w; // store original width for better loading speed

	// Scale values
	w = DavinciUtilities.getScaledValue(w, scale);
	h = DavinciUtilities.getScaledValue(h, scale);

	var canvas = goog.dom.createDom("canvas");
	
	canvas.w	= w;
	canvas.h 	= h;
	this.context 	= canvas.getContext("2d");
	this.context.clearRect(0, 0, w, h);
	this.graphics.setContext(this.context);
	
    var i, j, x, y;
    var r, g, b, a, clr;
    var output 		= this.context.getImageData(0, 0, w, h);
    var outputData 	= output.data;


	var processAlpha = (paletteType != DavinciUtilities.PIXELS_24BIT);

	// 32 bit image
	var colorsPerPixel = 4; // this is the reading byte value, 4 for 32bit

	if (paletteType == DavinciUtilities.PIXELS_INDEXED)
	{
		colorsPerPixel = 1; // read 1 byte per pixel
	}
	else if (paletteType == DavinciUtilities.PIXELS_24BIT)
	{
		colorsPerPixel = 3; // read RGB per pixel
	}
   
	var yRead;
    var data;
    i = 0;
    for (y = 0; y < h; y += 1) {
		var yRead = y;
		if (scale != DavinciUtilities.NO_SCALING)
		{
			// only for scaling we need to divide the source pixel position
			yRead = MathUtils.toInt((yRead << DavinciUtilities.SCALE_ACCURACY) / scale);
		}

		// Offset to the beginning of the row
		yRead *= origWidth * colorsPerPixel;
		yRead += pixelStartOffset;
        
		if(paletteType == DavinciUtilities.PIXELS_INDEXED && scale == DavinciUtilities.NO_SCALING) // most likely flag combination
        {
            var pixOffset = yRead;
            for (var x = w; --x >= 0;)
            {
                data = palette[MathUtils.toUByte(pixels[pixOffset++]) & 0xFF]; // index
                //data[out++] 

                clr 	= MathUtils.toUInt(data);

//                i 	= (y * w + (w-1-x)) * 4;
                outputData[i++] = (clr & 0x00FF0000) >>> 16;
                outputData[i++] = (clr & 0x0000FF00) >>> 8;
                outputData[i++] = (clr & 0x000000FF);
                if (processAlpha == false)
                  outputData[i++] = 255;
                else
                  outputData[i++] = clr >>> 24;
            }
        }
        else
        {
            for (x = 0; x < w; x++) {
//                i 	= (y * w + x) * 4;
                
                var xRead = x;
                if (scale != DavinciUtilities.NO_SCALING)
                {
                    // only for scaling we need to divide the source pixel position
                    xRead = MathUtils.toInt((xRead << DavinciUtilities.SCALE_ACCURACY) / scale);
                }

                var pix = yRead + xRead * colorsPerPixel; // compute source pixel position
                if (paletteType == DavinciUtilities.PIXELS_INDEXED)
                {
                	// 8 bit
                    data = palette[pixels[pix] & 0xFF]; // index	                	
                    //data[out++] 

                    clr 	= MathUtils.toUInt(data);

                    outputData[i++] = (clr & 0x00FF0000) >>> 16;
                    outputData[i++] = (clr & 0x0000FF00) >>> 8;
                    outputData[i++] = (clr & 0x000000FF);
                    if (processAlpha == false)
                      outputData[i++] = 255;
                    else
                      outputData[i++] = clr >>> 24;
                }
                else
                {
                    outputData[i++] = MathUtils.toUByte(pixels[pix++]);
                    outputData[i++] = MathUtils.toUByte(pixels[pix++]);
                    outputData[i++] = MathUtils.toUByte(pixels[pix++]);
                    
                    if (processAlpha)
                    {
                        outputData[i++] = MathUtils.toUByte(pixels[pix++]);
                    }
                    else
                    {
                        outputData[i++] = 255;
                    }
                }
            }
        }
    }
	
    // put the image data back after manipulation
    this.context.putImageData(output, 0, 0);	
};

JImage.prototype.onLoaded = function() {
	this.isLoaded = true;
	
	JImage.loadedCount++;
	//JImage.imgLoadStates[this.idx] = true;
	
	//if (this.imgIndex < JImage.imgMaxCount)
	//	JImage.imgLoadStatesByIndex[this.imgIndex] = true;
	
	if (this.image == null) {
		return;
	}
	
	if (this.transparent == 0)
		this.transparent = 1;
	
	this.width = this.image.width;
	this.height = this.image.height;
	
	//var canvas = goog.dom.createDom("canvas");
	var canvas = document.createElement('canvas');
	
	canvas.width	= this.image.width;
	canvas.height 	= this.image.height;
	this.context 	= canvas.getContext("2d");
	this.context.clearRect(0, 0, canvas.width, canvas.height);

	this.graphics.setContext(this.context);
	this.graphics.setClip(0, 0, canvas.width, canvas.height);
	
	this.context.globalCompositeOperation = 'source-over';
	this.context.drawImage(this.image, 0, 0);
	/*
    var output 		= this.context.getImageData(0, 0, width, height);
    var outputData 	= output.data;	
    
    var a = 0;
    
    for (py = 0; py < height; py += 1) {
      for (px = 0; px < width; px += 1) {
    	  i	= (py * width + px) * 4 + 3;
    	  a = outputData[i];
    	  if (a < 255)
    	  	  a = 0;
    	  outputData[i] = a;
      }
    }
    
    this.context.putImageData(output, 0, 0);*/
};

// int getHeight()
JImage.prototype.getHeight = function() {
	if (this.context == null) {
		return this.height;
	}
	return this.context.canvas.height;
};

// int getWidth()
JImage.prototype.getWidth = function() {
	if (this.context == null) {
		return this.width;
	}
	return this.context.canvas.width;
};

JImage.prototype.getImageElement = function() {
	return this.image;
};

JImage.prototype.getCanvas = function() {
	if (this.context == null) 
		return null;
	
	return this.context.canvas;
};

JImage.prototype.isLoaded = function() {
    return this.isLoaded;
};

JImage.prototype.getContext = function() {
	return this.context;
};

JImage.prototype.getGraphics = function() {
	if (this.context != null) {
		/*
		if (this.image != null) {
			this.graphics.clear();
			this.context.globalCompositeOperation ='copy';
			this.context.drawImage(this.image, 0, 0);
			this.context.globalCompositeOperation ='source-over';
		}*/
	}

	//if (this.graphics != null && this.graphics.context != null) {
		return this.graphics;
//}
	
	//return this.drawList;
};

JImage.prototype.clear = function() {
};

/**
 * Obtains ARGB pixel data from the specified region of this image and
 * stores it in the provided array of integers.  Each pixel value is
 * stored in <code>0xAARRGGBB</code> format, where the high-order
 * byte contains the
 * alpha channel and the remaining bytes contain color components for
 * red, green and blue, respectively.  The alpha channel specifies the
 * opacity of the pixel, where a value of <code>0x00</code>
 * represents a pixel that
 * is fully transparent and a value of <code>0xFF</code>
 * represents a fully opaque
 * pixel.
 *
 * <p> The returned values are not guaranteed to be identical to values
 * from the original source, such as from
 * <code>createRGBImage</code> or from a PNG
 * image.  Color values may be resampled to reflect the display
 * capabilities of the device (for example, red, green or blue pixels may
 * all be represented by the same gray value on a grayscale device).  On
 * devices that do not support alpha blending, the alpha value will be
 * <code>0xFF</code> for opaque pixels and <code>0x00</code> for
 * all other pixels (see <a
 * href="#alpha">Alpha Processing</a> for further discussion.)  On devices
 * that support alpha blending, alpha channel values may be resampled to
 * reflect the number of levels of semitransparency supported.</p>
 *
 * <p>The <code>scanlength</code> specifies the relative offset within the
 * array between the corresponding pixels of consecutive rows.  In order
 * to prevent rows of stored pixels from overlapping, the absolute value
 * of <code>scanlength</code> must be greater than or equal to
 * <code>width</code>.  Negative values of <code>scanlength</code> are
 * allowed.  In all cases, this must result in every reference being
 * within the bounds of the <code>rgbData</code> array.</p>
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
 *    rgbData[offset + (a - x) + (b - y) * scanlength] = P(a, b);</code></pre>
 * </TD>
 * </TR>
 * </TABLE>
 * <p>for</p>
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
 *
 * <p>The source rectangle is required to not exceed the bounds of
 * the image.  This means: </p>
 * <TABLE BORDER="2">
 * <TR>
 * <TD ROWSPAN="1" COLSPAN="1">
 *    <pre><code>
 *   x &gt;= 0
 *   y &gt;= 0
 *   x + width &lt;= image width
 *   y + height &lt;= image height    </code></pre>
 * </TD>
 * </TR>
 * </TABLE>
 * <p>
 * If any of these conditions is not met an
 * <code>IllegalArgumentException</code> is thrown.  Otherwise, in
 * cases where <code>width &lt;= 0</code> or <code>height &lt;= 0</code>,
 * no exception is thrown, and no pixel data is copied to
 * <code>rgbData</code>.</p>
 *
 * @param rgbData an array of integers in which the ARGB pixel data is
 * stored
 * @param offset the index into the array where the first ARGB value
 * is stored
 * @param scanlength the relative offset in the array between
 * corresponding pixels in consecutive rows of the region
 * @param x the x-coordinate of the upper left corner of the region
 * @param y the y-coordinate of the upper left corner of the region
 * @param width the width of the region
 * @param height the height of the region
 *
 * @throws ArrayIndexOutOfBoundsException if the requested operation would
 * attempt to access an element in the <code>rgbData</code> array
 * whose index is either
 * negative or beyond its length (the contents of the array are unchanged)
 *
 * @throws IllegalArgumentException if the area being retrieved
 * exceeds the bounds of the source image
 *
 * @throws IllegalArgumentException if the absolute value of
 * <code>scanlength</code> is less than <code>width</code>
 *
 * @throws NullPointerException if <code>rgbData</code> is <code>null</code>
 *
 */
// void getRGB(int[] rgbData, int offset, int scanlength, int x, int y, int width, int height)
JImage.prototype.getRGB = function(rgbData, offset, scanlength, x, y, width, height) {
	if (this.context == null) {
		return;
	}
	
    if (x < 0 || y < 0 || width < 0 || height < 0 || x + width > this.context.canvas.width || y + height > this.context.canvas.height) {
    	return null;
    }
    if (offset < 0 || scanlength < 0 || scanlength < offset + width) {
    	return null;
    }
    
    var datas = this.context.getImageData(x, y, width, height).data;
    
    var i, j;
    var s, d;
    
    for (i = 0; i < width; i++) {
    	for (j = 0; j < height; j++) {
    		s = (j * width + i) * 4;
    		d = offset + i + j * scanlength;
    		rgbData[d] = datas[s + 3] * 256 * 256 * 256 + datas[s] * 256 * 256 + datas[s + 1] * 256 + datas[s + 2];
    		//rgbData[d] = (datas[s + 3] >> 24) + (datas[s] >> 16) + (datas[s + 1] >> 8) + datas[s + 2];
    	}
    }
};

/**
 * Check if this image is mutable. Mutable images can be modified by
 * rendering to them through a <code>Graphics</code> object
 * obtained from the
 * <code>getGraphics()</code> method of this object.
 * @return <code>true</code> if the image is mutable,
 * <code>false</code> otherwise
 */
// boolean isMutable()
JImage.prototype.isMutable = function() {
	return this.mutable;
};

/* Clear base64 buffer */
JImage.clearBase64String = function() {
	JImage.buf = null;
	JImage.buf = ['data:image/png;base64,'];
	JImage.ch1 = -1;
	JImage.ch2 = -1;
	JImage.ch3 = -1;
};

/* Append char chr to base64 buffer */
JImage.addCharToBase64String = function(chr) {
	if (JImage.ch1 == -1)
		JImage.ch1 = MathUtils.toUByte(chr);
	else if (JImage.ch2 == -1)
		JImage.ch2 = MathUtils.toUByte(chr);
	else {
		JImage.ch3 = MathUtils.toUByte(chr);
		
		var curBufIdx = JImage.buf.length - 1; //length alwasy greater than 1;
        if(JImage.buf[curBufIdx].length>JImage.BUFSPLITLEN)
        {
            curBufIdx++;
            JImage.buf[curBufIdx] = "";
        }
	    JImage.buf[curBufIdx] += JImage.BASE64CHARS.charAt(JImage.ch1 >> 2);
	    JImage.buf[curBufIdx] += JImage.BASE64CHARS.charAt(((JImage.ch1 & 0x3) << 4) | ((JImage.ch2 & 0xF0) >> 4));
	    JImage.buf[curBufIdx] += JImage.BASE64CHARS.charAt(((JImage.ch2 & 0xF) << 2) | ((JImage.ch3 & 0xC0) >> 6));
	    JImage.buf[curBufIdx] += JImage.BASE64CHARS.charAt(JImage.ch3 & 0x3F);
	    
	    JImage.ch1 = -1;
	    JImage.ch2 = -1;
	    JImage.ch3 = -1;
	}
};

/* Get base64 formed string of image */
JImage.getBase64String = function() {
    var lastString = "";
    
	if (JImage.ch2 >= 0) {
        /*JImage.buf[0] += JImage.BASE64CHARS.charAt(JImage.ch1 >> 2);
        JImage.buf[0] += JImage.BASE64CHARS.charAt(((JImage.ch1 & 0x3)<< 4) | ((JImage.ch2 & 0xF0) >> 4));
        JImage.buf[0] += JImage.BASE64CHARS.charAt((JImage.ch2 & 0xF) << 2);
        JImage.buf[0] += "=";*/
        lastString += JImage.BASE64CHARS.charAt(JImage.ch1 >> 2);
        lastString += JImage.BASE64CHARS.charAt(((JImage.ch1 & 0x3)<< 4) | ((JImage.ch2 & 0xF0) >> 4));
        lastString += JImage.BASE64CHARS.charAt((JImage.ch2 & 0xF) << 2);
        lastString += "=";
	}
	else if (JImage.ch1 >= 0) {
        /*JImage.buf[0] += JImage.BASE64CHARS.charAt(JImage.ch1 >> 2);
        JImage.buf[0] += JImage.BASE64CHARS.charAt((JImage.ch1 & 0x3) << 4);
        JImage.buf[0] += "==";*/
        lastString += JImage.BASE64CHARS.charAt(JImage.ch1 >> 2);
        lastString += JImage.BASE64CHARS.charAt((JImage.ch1 & 0x3) << 4);
        lastString += "==";
    }
    var buf = JImage.buf.join("") + lastString;
    JImage.buf = [buf];
    return JImage.buf;
}

/**
 Return base64 inline image string from binary resources
 * @param str string-formed binary
 * @param pos
 * @param size
*/
JImage.binaryToBase64 = function(str, pos, size) {
    var out = [""], i = 0, c1, c2, c3;
    var curOutIdx = 0;
	if (!goog.isDef(pos)) {
		var len = str.length;
	    while (i < len) {
	        c1 = str.charCodeAt(i++) & 0xff;
            if(out[curOutIdx].length>JImage.BUFSPLITLEN)
            {
                out[++curOutIdx] = "";
            }
	        if (i == len) {
	            out[curOutIdx] += JImage.BASE64CHARS.charAt(c1 >> 2);
	            out[curOutIdx] += JImage.BASE64CHARS.charAt((c1 & 0x3) << 4);
	            out[curOutIdx] += "==";
	            break;
	        }
	        c2 = str.charCodeAt(i++);
	        if (i == len) {
	            out[curOutIdx] += JImage.BASE64CHARS.charAt(c1 >> 2);
	            out[curOutIdx] += JImage.BASE64CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
	            out[curOutIdx] += JImage.BASE64CHARS.charAt((c2 & 0xF) << 2);
	            out[curOutIdx] += "=";
	            break;
	        }
	        c3 = str.charCodeAt(i++);
	        out[curOutIdx] += JImage.BASE64CHARS.charAt(c1 >> 2);
	        out[curOutIdx] += JImage.BASE64CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
	        out[curOutIdx] += JImage.BASE64CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
	        out[curOutIdx] += JImage.BASE64CHARS.charAt(c3 & 0x3F);
	    }
	}
	else {
		i 	= pos;
		len = pos + size;
	    while (i < len) {
	        c1 = JImage.charCodeAt(str, i++) & 0xff;
            if(out[curOutIdx].length>JImage.BUFSPLITLEN)
            {
                out[++curOutIdx] = "";
            }
	        if (i == len) {
	            out[curOutIdx] += JImage.BASE64CHARS.charAt(c1 >> 2);
	            out[curOutIdx] += JImage.BASE64CHARS.charAt((c1 & 0x3) << 4);
	            out[curOutIdx] += "==";
	            break;
	        }
	        c2 = JImage.charCodeAt(str, i++);
	        if (i == len) {
	            out[curOutIdx] += JImage.BASE64CHARS.charAt(c1 >> 2);
	            out[curOutIdx] += JImage.BASE64CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
	            out[curOutIdx] += JImage.BASE64CHARS.charAt((c2 & 0xF) << 2);
	            out[curOutIdx] += "=";
	            break;
	        }
	        c3 = JImage.charCodeAt(str, i++);
	        out[curOutIdx] += JImage.BASE64CHARS.charAt(c1 >> 2);
	        out[curOutIdx] += JImage.BASE64CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
	        out[curOutIdx] += JImage.BASE64CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
	        out[curOutIdx] += JImage.BASE64CHARS.charAt(c3 & 0x3F);
	    }
	}
    return out.join("");
};

/* Return char code at pos */
JImage.charCodeAt = function(strings, pos) {
	return MathUtils.toByte(parseInt(strings[0][2 * pos], 16) * 16 + parseInt(strings[0][2 * pos + 1], 16));
};