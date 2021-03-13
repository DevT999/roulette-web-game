
// Main Game Class

GameMain = function() {
	var i = 0;
	
	GameMain.audioPlayers = new Array(GameMain.AUDIO_COUNT);
	for (var i = 0; i < GameMain.AUDIO_COUNT; i++)
	{
		//GameMain.audioPlayers[i] = HTML5AudioPlayer.create(GameMain.audioNames[i]);
	}
	
	//begin();
	
	GameMain.isLoaded = false;
	this.changeGame(GameMain.TYPE_ROULETTE);
};

GameMain.isResourcesLoaded	= false;
GameMain.isTouchEnabled 	= true;
GameMain.isSoundON 			= true;
GameMain.audioBack			= null;

// Game Type
GameMain.TYPE_NONE 			= 0;
GameMain.TYPE_SPLASH		= 1;
GameMain.TYPE_ROULETTE	= 2;

// Game State
GameMain.GAME_NONE 		= 0;
GameMain.GAME_BETTING 	= 1;
GameMain.GAME_DEALING 	= 2;
GameMain.GAME_EXIT		= 3;

// Game Scene State
GameMain.SCENE_NONE		= 0;
GameMain.SCENE_SPLASH	= 1;
GameMain.SCENE_LOADING	= 2;
GameMain.SCENE_GAME	 	= 3;

// Audio Type
GameMain.AUDIO_NONE		= -1;
GameMain.AUDIO_BACK		= 0;
GameMain.AUDIO_FIRE		= 1;
GameMain.AUDIO_MISS		= 2;
GameMain.AUDIO_POP1		= 3;
GameMain.AUDIO_POP2		= 4;
GameMain.AUDIO_POP3		= 5;
GameMain.AUDIO_POPMULTI	= 6;
GameMain.AUDIO_COUNT	= 1;

GameMain.audioNames		= [];
GameMain.audioPlayers 	= null;
GameMain.oSound = null;

// clear the resources.
GameMain.cleanRes = function()
{
    if(GameMain.audioBack != null)
    {
        GameMain.audioBack.stop();
        GameMain.audioBack = null;
    }
}

// change the game.
GameMain.prototype.changeGame = function(type)
{
	this.gameType = type;
	
	switch (type)
	{
		case GameMain.TYPE_ROULETTE:
	    	this.curGame = new Game();
			break;
	}
}

// pause the music.
GameMain.pauseMusic = function(audio)
{
	if (audio < 0 || audio >= GameMain.AUDIO_COUNT)
		return;
	
	if (GameMain.audioPlayers[audio] == null)
		GameMain.audioPlayers[audio] = HTML5AudioPlayer.create(audioNames[i]);
	
	if (GameMain.audioPlayers[audio] != null && GameMain.audioPlayers[audio].isPlaying())
        GameMain.audioPlayers[audio].pause();
}

// play the music.
GameMain.playMusic = function(audio)
{
	if (audio < 0 || audio >= GameMain.AUDIO_COUNT)
		return;
	
	if (GameMain.audioPlayers[audio] == null)
		GameMain.audioPlayers[audio] = HTML5AudioPlayer.create(audioNames[i]);
	
	if (GameMain.audioPlayers[audio] != null)
    {
    	if (audio == GameMain.AUDIO_BACK)
	        GameMain.audioPlayers[audio].setLooping(true);
	    else
	        GameMain.audioPlayers[audio].setLooping(false);
        GameMain.audioPlayers[audio].start();
    }
}

// exit the current game.
GameMain.prototype.exit = function()
{
    if (this.curGame != null)
    {
        this.curGame.cleanRes();
        this.curGame = null;
    }
    
    GameMain.cleanRes();
}

// main draw function.
GameMain.prototype.onDraw = function(canvas)
{
	//var st = System.currentTimeMillis();
	Graphics.MainGraphics.clear();

	if (GameMain.isResourcesLoaded == false)
	{
		GameMain.isResourcesLoaded = true;
		this.curGame.newGame();
	}
	
	if (this.curGame != null)
		this.curGame.onDraw();
	
    //Graphics.MainGraphics.setColor(255, 255, 255, 255);
    //Graphics.MainGraphics.setFontSize(24);
    //Graphics.MainGraphics.drawString("T : " + (System.currentTimeMillis() - st), 100, 70, 0);
}

// logic process function
GameMain.prototype.doLogic = function()
{
	if (this.curGame != null)
		this.curGame.doLogic();
}

// key event handler
GameMain.prototype.onKeyDown = function(i, keyevent)
{
}

// touch event handler
GameMain.prototype.onTouchEvent = function(motionEvent)
{
	if (this.curGame != null)
		this.curGame.onTouchEvent(motionEvent);
}

// pause the game.
GameMain.prototype.pause = function()
{
}

// restart the game.
GameMain.prototype.restart = function()
{
}

// save the game data.
GameMain.prototype.saveGameData = function()
{
    if(this.curGame != null)
        this.curGame.savaGameData();
}