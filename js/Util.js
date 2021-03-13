
Util = function() {
	
};

Util.drawString = function(str, x, y, color, size) {
	if (Graphics.MainGraphics == null)
		return;
	
	Graphics.MainGraphics.setFontSize(size);
	Graphics.MainGraphics.setColor(color);
	Graphics.MainGraphics.drawString(str, x, y, 0);
}

Util.drawNum = function(paint, bitmap, i, j, k, f, f1, flag) {
    if(i != 0)
    {
        var i1 = 1;		// int
        var l = 0;		// int
        for(l = 0; Math.floor(i / i1) > 0; l++)
            i1 *= 10;

        var ai = new Array(l);	// new int[l]
        var j1 = 1;		// int
        for(var l1 = 0; Math.floor(i / j1) > 0; l1++)
        {
            ai[l1] = Math.floor(i / j1) % 10;
            j1 *= 10;
        }

        if(!flag)
        {
            for(l--; l >= 0; l--)
            {
                Graphics.MainGraphics.save();
                Graphics.MainGraphics.setGlobalAlpha(paint.getAlpha());
                Graphics.MainGraphics.clipRect(j, k, f, f1);
                if(ai[l] != 0)
                    Graphics.MainGraphics.drawImage(bitmap, j - f * (2 + ai[l]), k, 0);
                else
                    Graphics.MainGraphics.drawImage(bitmap, j - 2 * f, k, 0);
                j = Math.floor(f + j);
                Graphics.MainGraphics.restore();
            }

        } else
        {
            for(var k1 = 0; k1 < l; k1++)
            {
                Graphics.MainGraphics.save();
                Graphics.MainGraphics.setGlobalAlpha(paint.getAlpha());
                Graphics.MainGraphics.clipRect(j, k, f, f1);
                if(ai[k1] != 0)
                    Graphics.MainGraphics.drawImage(bitmap, j - f * (2 + ai[k1]), k, 0);
                else
                    Graphics.MainGraphics.drawBitmap(bitmap, j - 2 * f, k, 0);
                j = j - f;
                Graphics.MainGraphics.restore();
            }

        }
    } else
    {
        Graphics.MainGraphics.save();
        Graphics.MainGraphics.setGlobalAlpha(paint.getAlpha());
        Graphics.MainGraphics.clipRect(j, k, f, f1);
        Graphics.MainGraphics.drawImage(bitmap, j - f * 2, k, 0);
        Graphics.MainGraphics.restore();
    }
};

Util.drawText = function(s, paint, i, j, k, l) {
	Graphics.MainGraphics.save();
	Graphics.MainGraphics.setGlobalAlpha(paint.getAlpha());
    paint.setColor(l);
    Graphics.MainGraphics.setColor(l);
    Graphics.MainGraphics.drawString(s, i + 1, j, 0);
    Graphics.MainGraphics.drawString(s, i, j - 1, 0);
    Graphics.MainGraphics.drawString(s, i, j + 1, 0);
    Graphics.MainGraphics.drawString(s, i - 1, j, 0);
    paint.setColor(k);
    Graphics.MainGraphics.setColor(k);
    Graphics.MainGraphics.drawString(s, i, j, 0);
    Graphics.MainGraphics.restore();
}

Util.getNewPoint = function(point, point1, d) {
    var point2 = new Point();		// Point
    
    if(d != 0)
    {
        var f1 = point.x - point1.x;				// float
        var f2 = point.y - point1.y;				// float
        var f  = Math.sqrt(f1 * f1 + f2 * f2);		// float
        
        f1 = Math.atan2(f2, f1) + (3.1415926535897931 * d) / 180;
        point2 = new Point(f * Math.cos(f1) + point1.x, f * Math.sin(f1) + point1.y);
    }
    else
    {
        point2 = point;
    }
    
    return point2;
};

// public static final String readPreferences(String s)
Util.readPreferences = function(s) {
};

// public static final String[] split(String s, String s1)
Util.split = function(s, s1) {
	return s.split(s1);
};

// public static final void writePreferences(String s, String s1)
Util.writePreferences = function(s, s1) {
/*
    android.content.SharedPreferences.Editor editor = GameMain.context.getSharedPreferences("MyPrefsFile", 0).edit();
    editor.putString(s, s1);
    editor.commit();
*/
};
