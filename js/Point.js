
Point = function(f, f1) {
	this.x = 0;		// float
	this.y = 0;		// float
	
	switch (arguments.length)
	{
		case 1:
			this.x = f.x;
			this.y = f.y;
			break;
		
		case 2:
			this.x = f;
			this.y = f1;
			break;
	}
};