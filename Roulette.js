
Roulette = function() {
	
};

Roulette.GameObject 	= null;		// Main game object

Roulette.CANVAS_WIDTH 	= 960;		// graphics canvas width
Roulette.CANVAS_HEIGHT 	= 600;		// graphics canvas height

// layout of main roulette area
Roulette.left		= 0;
Roulette.top		= 0;
Roulette.width		= 0;
Roulette.height		= 0;

// scale factor
Roulette.scaleX		= 1;
Roulette.scaleY		= 1;

// canvas for background
Roulette.backCanvas	= null;

// touch event object
Roulette.touchEvent	= new MotionEvent();

Roulette.resizeCallCount = 0;

// variables for pre-load
Roulette.isLoading 	 = true;
Roulette.loadedCount = 0;
Roulette.loadImage = [];

// images list for pre-load
Roulette.imgFileList = [
	"ball.png",
	"bet_chip.png",
	"betting_back_0.jpg", "betting_back_1.jpg", "betting_back_2.jpg",
	"board_chip_1.png", "board_chip_2.png", "board_chip_3.png", 
	// "board_chip_4.png", "board_chip_5.png",
	"button_clearbet_normal.png", "button_clearbet_hover.png", "button_clearbet_disable.png",
	"button_rebet_normal.png", "button_rebet_hover.png", "button_rebet_disable.png",
	"button_spin_normal.png", "button_spin_hover.png", "button_spin_disable.png",
	"button_regame_normal.png", "button_regame_hover.png", "button_regame_disable.png",
	"chip_1.png", "chip_2.png", "chip_3.png"
	// , "chip_4.png", "chip_5.png"
	, "chip_32.png",
	"golden_chip_large.png", "golden_chip_small.png",
	"highlight.png",
	"resultpanel_black.png", "resultpanel_green.png", "resultpanel_red.png",
	"rotate_back_0.png", "rotate_back_1.png", "rotate_back_2.png",
	"wheel-0.png",
	 "wheel-1_0.png", "wheel-1_1.png", "wheel-1_2.png",
	 "wheel-2.png",
	"winnumber_black.png", "winnumber_green.png", "winnumber_red.png",
	"winpopup_back.png"
	,"look_thru_0.png", "look_thru_1.png", "look_thru_2.png"
];

// set the view port again for mobile platforms.
Roulette.setViewport = function ( viewportWidth ) {
	var meta = null,
		head,
		content;

	// Do nothing if viewport setting code is already in the code.
	$( "meta[name=viewport]" ).each( function ( ) {
		meta = this;
		return;
	});
	if ( meta ) {	// Found custom viewport!
		content = $( meta ).prop( "content" );
		viewportWidth = content.replace( /.*width=(device-width|\d+)\s*,?.*$/gi, "$1" );
		console.log( "Viewport is set to '" + viewportWidth + "' in a meta tag. Framework skips viewport setting." );
	} else {
		// Create a meta tag
		meta = document.createElement( "meta" );
		if ( meta ) {
			meta.name = "viewport";
			content = [ "width=", viewportWidth, ", user-scalable=no, initial-scale=1.0, maximum-scale=1.0" ].join( "" );
			if ( ! isNaN( viewportWidth ) ) {
				// Fix scale to 1.0, if viewport width is set to fixed value.
				// NOTE: Works wrong in Tizen browser!
				//content = [ content, ", initial-scale=1.0, maximum-scale=1.0" ].join( "" );
			}
			meta.content = content;
			console.log( content );
			head = document.getElementsByTagName( 'head' ).item( 0 );
			head.insertBefore( meta, head.firstChild );
		}
	}
	//alert(viewportWidth);
	return viewportWidth;
};

// initialize the main objects.
Roulette.init = function() {
	
	console.log("## Roulette.init");
	Game.prototype.state = 0;
	
	var viewportWidth = Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight);
	if (navigator.userAgent.match('iPhone') != null)
		viewportWidth = 320;
	if (navigator.userAgent.match('Android') != null)
		viewportWidth = 480;

	//viewportWidth = this.setViewport( viewportWidth );	

	// create the main game object.
	Roulette.GameObject = new GameMain();
	
	//var myScroll;
	//myScroll = new iScroll('chip_area', {desktopCompatibility:true, vScrollbar:false, hScrollbar:true});

	// add the canvas object to the specified div object.
	var pageDiv = document.getElementById('game_area');
	
	var canvas = null, context = null;

	// create the canvas object to draw the game.
	canvas = document.createElement('canvas');
	canvas.width  = Roulette.CANVAS_WIDTH;
	canvas.height = Roulette.CANVAS_HEIGHT;
	
	pageDiv.appendChild(canvas);
	context = canvas.getContext("2d");
	
	// create the main graphics object to draw.
	Graphics.MainGraphics = new Graphics(context);
	Graphics.MainGraphics.clipRect(0, 0, Roulette.CANVAS_WIDTH, Roulette.CANVAS_HEIGHT);

	// call the loop function
	Roulette.Animate(new Date().getTime());
	
	// preload all images.
	Roulette.preloadImages();

	document.body.addEventListener('touchstart', function(e) {
		e.preventDefault();
	}, false);
	
	// assign the touch event.
	$('#game_area').on('vmousedown', Roulette.onMouseDown);
	$('#game_area').on('vmouseup', Roulette.onMouseUp);
	$('#game_area').on('mousemove', Roulette.onMouseMove);
	$('#game_area').on('touchmove', Roulette.onMouseMove);

	// start the main loop.
	setInterval(Roulette.Animate, 15);
	
	// resize the game screen.
	Roulette.onResize();
};

// preload all images.
Roulette.preloadImages = function() {
	var i = 0;
	
	for (i = 0; i < Roulette.imgFileList.length; i++) {
		var img = new Image();
		img.src = "img/" + Roulette.imgFileList[i];
		Roulette.loadImage[i] = img;
		//console.log(img);
		img.onload = function() {
			Roulette.loadedCount++;
		};
	}
	console.log(Roulette.loadImage[2]);
};

// Main Loop Function
// dt - current time
Roulette.frameCount = 0;

Roulette.Animate = function() {
	if (Roulette.isLoading) {
		if (Roulette.loadedCount >= Roulette.imgFileList.length) {
			Roulette.isLoading = false;
			$('#loading_area').hide();
		}
		
		return;
	}

	if (Roulette.GameObject == null)
		return;

	Roulette.GameObject.doLogic();
	Roulette.GameObject.onDraw();
	
	//Graphics.MainGraphics.clear();
    //Graphics.MainGraphics.setColor(255, 255, 255, 255);
    //Graphics.MainGraphics.setFontSize(24);
	//Graphics.MainGraphics.drawString("F : " + (++Roulette.frameCount), 150, 100, 0);
	
};

// get the relative mouse position on the game screen.
Roulette.getMousePosition = function(event) {
	var pageDiv = document.getElementById('game_area');
	var posX = 0;
	var posY = 0;
	
	if ((typeof event.changedTouches) == "undefined")
	{
		posX = event.pageX;
		posY = event.pageY;
	}
	else
	{
		var i = 0;
		var touches = event.changedTouches;
		
		for (i = 0; i < touches.length; i++)
		{
			posX = touches[i].pageX;
			posY = touches[i].pageY;
			
			if ((typeof posX != "undefined") && (typeof posY != "undefined"))
				break;
		}
	}
	
	if (typeof posX == "undefined")
	{
		var evt = window.event;
		
		posX = evt.touches[0].pageX+100;
		posY = evt.touches[0].pageY;
	}
	
	posX = (posX - pageDiv.offsetLeft - Roulette.left) / Roulette.scaleX;
	posY = (posY - pageDiv.offsetTop - Roulette.top) / Roulette.scaleY;
	
	Roulette.touchEvent.setX(posX);
	Roulette.touchEvent.setY(posY);
}

// Mouse Down Event
Roulette.onMouseDown = function(event) {
	event.preventDefault();

	if (Roulette.isLoading)
		return;

	Roulette.getMousePosition(event);
	Roulette.touchEvent.setAction(0);
	
	Roulette.GameObject.onTouchEvent(Roulette.touchEvent);
};

// Mouse Move Event
Roulette.onMouseMove = function(event) {
	event.preventDefault();

	if (Roulette.isLoading)
		return;

	Roulette.getMousePosition(event);
	Roulette.touchEvent.setAction(2);
	
	Roulette.GameObject.onTouchEvent(Roulette.touchEvent);
};

// Mouse Up Event
Roulette.onMouseUp = function(event) {
	event.preventDefault();

	if (Roulette.isLoading)
		return;

	Roulette.getMousePosition(event);
	Roulette.touchEvent.setAction(1);
	
	
	if(!$('#help').hasClass('active')){
		if(localStorage.getItem('effectSetting') == '' && $('#option_show').css('display') == 'none') {
			if(Roulette.GameObject.oSound != null)
				Roulette.GameObject.oSound.destruct();

			Roulette.GameObject.oSound = soundManager.createSound(
			{
	      		id: 'cSound',
	      		url: 'audio/menu_on.mp3',
	      		loops:1,
	      		autoPlay:true,
	      		volume: localStorage.getItem('effect_volume')
	    	});
		}
		Roulette.GameObject.onTouchEvent(Roulette.touchEvent);
	}
	
	else $('#help').trigger('vclick');
};

// Resize Event 
	//according to the size of screen,changing the range of screen
Roulette.onResize = function() {
	var winWidth  = $(window).width();
	var winHeight = $(window).height();

	// calculate the new width, height, scale.
	var width  = Roulette.CANVAS_WIDTH;
	var height = Roulette.CANVAS_HEIGHT;
	var wscale = winWidth / width;
	var hscale = winHeight / height;
	var scale  = wscale;

	// keep the aspect ration.	
	if (hscale < wscale)
		scale = hscale;
	
	width *= scale;
	height *= scale;
	
	var left = (winWidth - width) / 2;
	var top = (winHeight - height) / 2;

	Roulette.left 	= left;
	Roulette.top 	= top;
	Roulette.width	= winWidth;
	Roulette.height	= winHeight;
	Roulette.scaleX = scale;
	Roulette.scaleY = scale;
	console.log(winHeight+'/'+scale);

	// keep the game area as the center of window.
	var scale_css = 'translate(' + Roulette.left + 'px,' + Roulette.top + 'px) ' + 'scale(' + Roulette.scaleX + ',' + Roulette.scaleY + ')';

	$('#container').css('transform', scale_css);
	$('#container').css('-webkit-transform', scale_css);
	$('#container').css('-moz-transform', scale_css);
	$('#container').css('-o-transform', scale_css);
	$('#container').css('-ms-transform', scale_css);

	$('#container').css('transform-origin', '0% 0%');
	$('#container').css('-moz-transform-origin', '0% 0%');
	$('#container').css('-ms-transform-origin', '0% 0%');
	$('#container').css('-webkit-transform-origin', '0% 0%');
	$('#container').css('-o-transform-origin', '0% 0%');
	$('#container').css('transform-origin', '0% 0%');
	var select_left = parseInt((winWidth - scale * 960)/2 + scale * 960 * 0.4) + "px";
	var select_top = parseInt((winHeight - scale * 600)/2 + (scale * 600 * 0.2855)) + "px";
	var select_size = parseInt(10 * scale) + "px";
	console.log(select_left);
	//Roulette.resizeCallCount++;
	//if (Roulette.resizeCallCount < 5)
	//	setTimeout(Roulette.onResize, 1000);
	    if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(navigator.userAgent)){
        	$('#select').remove();
        	$('#container').before('<select id="select"><option value="background.mp3">background.mp3</option><option value="Crossroads.mp3">crossroads.mp3</option><option value="Track02.mp3">Track02.mp3</option></select>');
        	$('#select').css('position','absolute').css('left',select_left).css('top',select_top).css('font-size',select_size).css('background','#e89bba').css('width' , parseInt(100 * scale) + "px").css('height' , parseInt(20 * scale) + "px" ).css('z-index',10000);
        	if( $('#option_show').css('display') == 'none')  $('#select').hide();
        	//$('option').css('position','absolute !important').css('left','200px !important');
        	if(!localStorage.getItem('bgm_volume'))
        		localStorage.setItem('bgm_volume',100);
        	$('#draggable1').css('left',localStorage.getItem('bgm_volume')*1.9+203+"px");
        	$('#volume1').css('width',localStorage.getItem('bgm_volume')*1.9+"px");
        	var drag_left =  (winWidth - scale * 960)/2 + scale * 960 * 0.27;
        	$('#draggable1').draggable({
	        	axis:'x',
	        	start:function(){

	        	},
	        	drag:function(event,ui){
	        		ui.position.left=Math.min(Math.max((event.clientX-drag_left)*0.95/scale,203),393);
	        		ui.position.top = 95;
	        		$('#volume1').css('width',(ui.position.left - 203)+'px');
	        		bgm_volume = parseInt((ui.position.left - 203.0) / 190 * 100);
	        		localStorage.setItem('bgm_volume',bgm_volume);
	        		mySound.setVolume(bgm_volume);
	        		console.log(event.clientX);
	        	},
	        	stop:function(){
	        	}
	        });
	        if(!localStorage.getItem('effect_volume'))
        		localStorage.setItem('effect_volume',100);
        	$('#draggable2').css('left',localStorage.getItem('effect_volume')*1.9+203+"px");
        	$('#volume2').css('width',localStorage.getItem('effect_volume')*1.9+"px");
        	$('#draggable2').draggable({
	        	axis:'x',
	        	start:function(){

	        	},
	        	drag:function(event,ui){
	        		ui.position.left=Math.min(Math.max((event.clientX-drag_left)*0.95/scale,203),393);
	        		ui.position.top = 143;
	        		$('#volume2').css('width',(ui.position.left - 203)+'px');
	        		effect_volume = parseInt((ui.position.left - 203.0) / 190 * 100);
	        		localStorage.setItem('effect_volume',effect_volume);
	        	},
	        	stop:function(){
	        	}
	        });
        }
        else if (/Chrome\/(\S+)/.test(navigator.userAgent))
        {
        	$('#select').css('position','absolute').css('left','40px').css('top','81px').css('font-size','13px').css('background','#e89bba').css('width','100px').css('cursor','pointer');
        	if(!localStorage.getItem('bgm_volume'))
        		localStorage.setItem('bgm_volume',100);
        	$('#draggable1').css('left',localStorage.getItem('bgm_volume')*1.9+200+"px");
        	$('#volume1').css('width',localStorage.getItem('bgm_volume')*1.9+"px");
        	var drag_left =  (winWidth - scale * 960)/2 + scale * 960 * 0.28;
        	$('#draggable1').draggable({
	        	axis:'x',
	        	start:function(){

	        	},
	        	drag:function(event,ui){
	        		ui.position.left=Math.min(Math.max((event.clientX-drag_left)*0.98/scale,200),390);
	        		ui.position.top = 95;
	        		$('#volume1').css('width',(ui.position.left - 200)+'px');
	        		bgm_volume = parseInt((ui.position.left - 200.0) / 190 * 100);
	        		localStorage.setItem('bgm_volume',bgm_volume);
	        		mySound.setVolume(bgm_volume);
				},
	        	stop:function(){
	        	}
	        });
	        if(!localStorage.getItem('effect_volume'))
        		localStorage.setItem('effect_volume',100);
        	$('#draggable2').css('left',localStorage.getItem('effect_volume')*1.9+200+"px");
        	$('#volume2').css('width',localStorage.getItem('effect_volume')*1.9+"px");
        	$('#draggable2').draggable({
	        	axis:'x',
	        	start:function(){

	        	},
	        	drag:function(event,ui){
	        		ui.position.left=Math.min(Math.max((event.clientX-drag_left)*0.98/scale,200),390);
	        		ui.position.top = 142;
	        		$('#volume2').css('width',(ui.position.left - 200)+'px');
	        		effect_volume = parseInt((ui.position.left - 200.0) / 190 * 100);
	        		localStorage.setItem('effect_volume',effect_volume);
				},
	        	stop:function(){
	        	}
	        });
        }

	Roulette.GameObject.curGame.updateWinNumber();
	
	window.top.scrollTo(0, 1);
};
