
MathUtils = function() {
	
};

// constant definition
MathUtils.SIN_ACCURACY 		= 15;
MathUtils.ANGLE_ACCURACY 	= 8;

// variables definition
MathUtils.Values 			= null;	// private static int[] MathUtils.Values;
MathUtils.seed 				= 0;	// private static int MathUtils.seed;

// private static void l20090o0()
MathUtils.init = function() {
	MathUtils.Values = new_array(1, 0, 256);	// new int[256];
	
	var step = Math.floor(((31415 * 2) << MathUtils.SIN_ACCURACY) / (256 * 10000));
	var minv = 0;
	var maxv = 1 << MathUtils.SIN_ACCURACY;
	var i = 0;
	
	for (;i < 64; i++) {
		MathUtils.Values[i] = minv;
		maxv -= (minv * step) >> MathUtils.SIN_ACCURACY;
		minv += (maxv * step) >> MathUtils.SIN_ACCURACY;
	}
	
	MathUtils.Values[i++] = 1 << MathUtils.SIN_ACCURACY;
	for (;i <= 128; i++) {
		MathUtils.Values[i] = MathUtils.Values[64 - (i - 64)];
	}
	for (;i < 256; i++) {
		MathUtils.Values[i] = -MathUtils.Values[i - 128];
	}
};
/*
// public static final int sin(int l20091o0)
MathUtils.sin = function(alpha) {
	var powv = 1 << MathUtils.ANGLE_ACCURACY;
	var bitflag = powv - 1;
	if (MathUtils.Values == null) {
		MathUtils.init();
	}
	var value = alpha & bitflag;
	alpha >>= MathUtils.ANGLE_ACCURACY;
	
	return (MathUtils.Values[(alpha + 1) & 0xFF] * value + MathUtils.Values[alpha & 0xFF] * (powv - value)) >> MathUtils.ANGLE_ACCURACY;
};

// public static final int cos(int l20092o0)
MathUtils.cos = function(alpha) {
	return MathUtils.sin(alpha + (64 << MathUtils.ANGLE_ACCURACY));
};
*/
// public static void setSeed(int l20093o0)
MathUtils.setSeed = function(seed) {
	MathUtils.seed = seed;
};

// public static final int random()
MathUtils.random_org = function() {
	var rvalue = MathUtils.seed;
	
	rvalue *= 0x41c64e6d;
	rvalue += 0x3039;
	rvalue = MathUtils.toInt(rvalue);
	MathUtils.seed = rvalue;
	
	return rvalue;
};

// public static final int random(int l20094o0)
MathUtils.random = function(factor) {
	if (!goog.isDef(factor))
	{
		return MathUtils.random_org();
	}
	
	return ((MathUtils.random_org() >>> 15) * factor) >>> 17;
};

// public static final boolean randomBoolean()
MathUtils.randomBoolean = function() {
	return MathUtils.random() > 0;
};

MathUtils.decimalToHex = function(decimal) {
	var hex = '';
	var n = 0;
	
	if (decimal <= 0) {
		return '0';
	}
	
	while (decimal > 0) {
		n = decimal % 16;
		if (n <= 9) {
			hex = n + hex;
		}
		else {
			hex = String.fromCharCode(55 + n) + hex;
		}
		
		decimal = (decimal - n) / 16;
	};
	
	return hex;
};


MathUtils.toByte = function(n) {
	n = n & 0xFF;
	if (n >= 128)
		return n - 256;
	return n;
};

MathUtils.toUByte = function(n) {
	n = n & 0xFF;
	if (n < 0)
		return n + 256;
	return n;
};

MathUtils.toShort = function(n) {
	n = n & 0xFFFF;
	if (n >= 32768)
		return n - 65536;
	return n;
};

MathUtils.toUShort = function(n) {
	n = n & 0xFFFF;
	if (n < 0)
		return n + 65536;
	return n;
};

MathUtils.toInt = function(n) {
	n = n & 0xFFFFFFFF;
	return n;
};

MathUtils.toUInt = function(n) {
	n = n & 0xFFFFFFFF;
	if (n < 0)
		return n + 4294967296;
	return n;
};


MathUtils.hypotenuse = function(a, b) {
	return Math.sqrt(a*a+b*b);
};

MathUtils.radToDeg = function(a) {
	return a * (180 / Math.PI);
};

MathUtils.cos = function(a) {
	return Math.cos(MathUtils.degToRad(a));
};

MathUtils.sin = function(a) {
	return Math.sin(MathUtils.degToRad(a));
};

MathUtils.acos = function(a) {
	return MathUtils.radToDeg(Math.acos(a));
};

MathUtils.atan2 = function(b, a) {
	return MathUtils.radToDeg(Math.atan2(b,a));
};

MathUtils.degToRad = function(b, c) {
	var a = (c != undefined ) ? c : 8;
	
	return Animation.utils.toNthDecimalPlace(b * 0.017453292519943295, a);
};

MathUtils.toNthDecimalPlace = function(a, c) {
	var b = (c != undefined) ? c : 1;
	
	return Math.round(a * Math.pow(10, b)) / Math.pow(10, b);
};
