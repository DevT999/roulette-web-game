MotionEvent = function() {
	this.x 		= 0;
	this.y 		= 0;
	this.action = 0;
};

MotionEvent.prototype.setAction = function(action) {
	if($('#option_show').css('display') == 'none'){
		this.action = action;
	}
	else return;
}

MotionEvent.prototype.getAction = function() {
	if($('#option_show').css('display') == 'none')
	{
		return this.action;
	}
	else return;
	
};

MotionEvent.prototype.setX = function(x) {
	if($('#option_show').css('display') == 'none')
	{
		this.x = x;
	}
	else return;

	
}

MotionEvent.prototype.getX = function() {
	if($('#option_show').css('display') == 'none')
	{
		return this.x;
	}
	else return;
	
};

MotionEvent.prototype.setY = function(y) {
	if($('#option_show').css('display') == 'none')
	{
		this.y = y;
	}
	else 
		return;

	
};

MotionEvent.prototype.getY = function() {
	if($('#option_show').css('display') == 'none')
	{
		return this.y;
	}
	else 
		return;
	
};