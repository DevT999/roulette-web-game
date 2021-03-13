

HTML5AudioPlayer = function()
{
	this.element 	= null;
	this.vListeners = null; //Vector
	this.strType 	= null;
	this.curState 	= HTML5AudioPlayer.UNREALIZED;
	this.src 		= "";
	this.isLooping	= false;
};

HTML5AudioPlayer.UNREALIZED 	= 0;
HTML5AudioPlayer.REALIZED 		= 1;
HTML5AudioPlayer.PREFETCHED 	= 2;
HTML5AudioPlayer.STARTED 		= 3;
HTML5AudioPlayer.CLOSED 		= 4;
HTML5AudioPlayer.STOPPED		= 5;
HTML5AudioPlayer.ENDED			= 6;

HTML5AudioPlayer.prototype.element = null;
HTML5AudioPlayer.prototype.vListeners = null; //Vector
HTML5AudioPlayer.prototype.strType = null;
HTML5AudioPlayer.prototype.curState = HTML5AudioPlayer.UNREALIZED;
HTML5AudioPlayer.prototype.src = "";


HTML5AudioPlayer.loadedCount	= 0;
HTML5AudioPlayer.createdCount	= 0;

//class SampledAudioPlayer implements Player, LineListener 

HTML5AudioPlayer.create = function(src)
{
	var player = new HTML5AudioPlayer();
	player.open(src);
	
	return player;
}

HTML5AudioPlayer.prototype.open = function(src) 		//return type: boolean 
{
    this.src = src;
	var audioElement = document.getElementById(src);
	if(audioElement == null)
	{
		audioElement = document.createElement('audio');
		/*
		var source;
		
		source = document.createElement('source');
		source.setAttribute('src', "audio/" + src + ".ogg");
		source.setAttribute('type', 'audio/ogg');
		audioElement.appendChild(source);
		
		source = document.createElement('source');
		source.setAttribute('src', "audio/" + src + ".wav");
		source.setAttribute('type', 'audio/wav');
		audioElement.appendChild(source);

		source = document.createElement('source');
		source.setAttribute('src', "audio/" + src + ".mp3");
		source.setAttribute('type', 'audio/mpeg');
		audioElement.appendChild(source);
		*/
		audioElement.parent = this;
		
		HTML5AudioPlayer.createdCount++;

		audioElement.setAttribute('preload', 'auto');
		//audioElement.setAttribute('src', "audio/" + src + ".wav");
		audioElement.setAttribute('id', src);
				
		//audioElement.load();
		audioElement.loop = true;
		
		//audioElement.play();
		if (audioElement.readyState != 4)
		{
			audioElement.addEventListener("canplaythrough", 
				function() {
					//alert('canplaythrough');
					this.parent.curState = HTML5AudioPlayer.PREFETCHED;
					HTML5AudioPlayer.loadedCount++;
				}
			, true);
			audioElement.addEventListener("load", 
				function() {
					//alert('load');
					this.parent.curState = HTML5AudioPlayer.PREFETCHED;
					HTML5AudioPlayer.loadedCount++;
				}
			, true);
			
			setTimeout(function(){ audioElement.pause(); }, 1);
		}
		else
		{
			//alert('ready play');
			this.parent.curState = HTML5AudioPlayer.PREFETCHED;
			HTML5AudioPlayer.loadedCount++;
		}
		
		audioElement.addEventListener("error", 
			function() { this.curState = HTML5AudioPlayer.UNREALIZED; this.element = null;}
			, true);
		
		audioElement.addEventListener('ended', 
				this.update
				, false);
		
		document.body.appendChild(audioElement);
		this.element = audioElement;
		this.curState = HTML5AudioPlayer.REALIZED;
		
		//audioElement.play();
	}
	else
	{
        try
        {
    		this.element = audioElement;
            //alert("element = " + this.element + " curTime = " + this.element.currentTime);
    		this.element.currentTime = 0;
            //alert("currentTime okay");
    		this.curState = HTML5AudioPlayer.PREFETCHED;
            //alert("currentState okay");
        }
        catch(err)
        {
            document.body.removeChild(this.element);
            this.open(src);
        }
	}    
};


HTML5AudioPlayer.prototype.addPlayerListener = function(/*PlayerListener*/ playerListener) 		//return type: void 
{
	if( this.vListeners == null )
		this.vListeners = new Vector();
	this.vListeners.add( playerListener );
};


HTML5AudioPlayer.prototype.close = function() 		//return type: void 
{
	//MIDletBridge.removeMediaPlayer(this);
	if( this.element != null )
	{
		try
		{
			this.element.pause();
			//document.removeChild(this.element);
			this.curState = HTML5AudioPlayer.CLOSED;
		}
		catch(e)
		{
			
		}
	};
};

HTML5AudioPlayer.prototype.deallocate = function() {		//return type: void 
	
};

HTML5AudioPlayer.prototype.getContentType = function() {		//return type: String 
	return null;
	//return strType;
};

HTML5AudioPlayer.prototype.getDuration = function() {		//return type: long 
	// TODO Auto-generated method stub
	return 0;
};

HTML5AudioPlayer.prototype.getMediaTime = function() {		//return type: long 
	if( this.element != null )
		return this.element.currentTime;
	return 0;
};

HTML5AudioPlayer.prototype.getState = function() {		//return type: int 
	// TODO Auto-generated method stub
	return this.curState;
};

HTML5AudioPlayer.prototype.prefetch = function() {		//return type: void 
	// TODO Auto-generated method stub
	
};

HTML5AudioPlayer.prototype.realize = function()	{		//return type: void 
	// TODO Auto-generated method stub
};


HTML5AudioPlayer.prototype.removePlayerListener = function(/*PlayerListener*/ playerListener) 		//return type: void 
{
   if( this.vListeners == null )
	   return;
	var index = this.vListeners.indexOf(playerListener);
	if(index!=-1)
	{
		this.vListeners.remove(index);
	}
};

HTML5AudioPlayer.prototype.setLooping = function(/*int*/ loop) {		//return type: void 
	if( this.element != null )
	{
		this.element.loop 	= loop;
	}
	
};
HTML5AudioPlayer.prototype.setLoopCount = function(/*int*/ count) {		//return type: void 
	if( this.element != null )
	{
		//this.element.loop = (count == 1) ? false:true;
		this.isLooping = (count == 1) ? false:true;
		//seems a little bad.
	}
	
};

HTML5AudioPlayer.prototype.setMediaTime = function(/*long*/ now){		//return type: long 
	if( this.element != null )
		this.element.currentTime = now;
	return 0;
};

HTML5AudioPlayer.prototype.start = function() {		//return type: void
	if (this.element != null)
	{
		this.element.play();
		this.curState = HTML5AudioPlayer.STARTED;
	}
};

HTML5AudioPlayer.prototype.pause = function() {		//return type: void 
	if( this.element != null )
	{
		this.element.pause();
		this.curState = HTML5AudioPlayer.STOPPED;
	}
	
};
HTML5AudioPlayer.prototype.stop = function() {		//return type: void 
	if( this.element != null )
	{
		this.element.pause();
		this.curState = HTML5AudioPlayer.STOPPED;
	}
	
};

HTML5AudioPlayer.prototype.isPlaying = function() {
	return (this.curState == HTML5AudioPlayer.STARTED);
};

HTML5AudioPlayer.prototype.getControl = function(/*String*/ controlType) {		//return type: Control 
	// TODO Auto-generated method stub
	return null;
};


HTML5AudioPlayer.prototype.getControls = function() {		//return type: Controls[]
	// TODO Auto-generated method stub
	return null;
};

HTML5AudioPlayer.prototype.update = function( event ) 		//return type: void 
{
	if (event.type == "ended")
	{
		this.parent.curState = HTML5AudioPlayer.ENDED;
		this.currentTime = 0;
		this.pause();
	} else if(event == "")
	{
		
	}
};

