Game = function()
{
	var i, j, method;
	
	// current game state
	this.gameState 	= GameMain.GAME_NONE;
	// current game scene state
	this.sceneState = GameMain.SCENE_NONE;
	//current game method
	this.gameMethod =1;
	
	this.wheel = new Wheel(this);
	
	// image objects
	this.imgBack 		= null;
	this.imgBetBoards 	= null;
//	this.imgRotatePanel	= null;

	// small and large gold image
	this.imgSmallGold	= null;	
	this.imgLargeGold	= null;	
	
	// button datas(left, top, width, height)
	this.buttonDatas	= null;
	this.betBoardDatas 	= null;
	// rotate panel data(left, top, width, height)
	this.panelDatas		= null;
	// betting chip area
	this.bettingChipAreas = null;
	
	// current focus board index
	this.selBoardIndex		= -1;
	
	// current focus round board index
	this.selRoundIndex		= -1;
	this.auto_setting       = 0;
	this.initButtonDatas();
	// money variable
	this.totalMoney			= Game.INITIAL_MONEY;
	this.totalBettingMoney	= 0;
	this.totalEarnedMoney	= 0;
	this.totalWinMoney		= 0;
	this.curWinMoney		= 0;
	this.bettingInfos		= new Array(Game.BETBOARD_COUNT);
	this.bettingCounts		= new Array(Game.BETBOARD_COUNT);
	this.oldBettingInfos	= new Array(Game.BETBOARD_COUNT);
	this.oldBettingCounts	= new Array(Game.BETBOARD_COUNT);
	this.option_status 		= 0;
	this.state 				= 1;
	infinite_play 		= 0;
	
	for (i = 0; i < Game.BETBOARD_COUNT; i++)
	{
		this.bettingInfos[i]  = [];
		this.bettingCounts[i] = 0;
	}
	
	// betting history
	
	for (i = 0; i < Game.BETBOARD_COUNT; i++)
	{
		this.oldBettingInfos[i]  = [];
		this.oldBettingCounts[i] = 0;
	}
	
	// winning number history
	this.winNumbers 	= [];
	this.winStatus 		= [];
	
	// index for currently selected betting amount 
	Game.curBettingAmountIndex = 0;
	
	// rotation variables
	this.rotateAngle 	= 0;
	this.rotateSpeed 	= 0;
	this.ballAngle		= 0;
	this.ballSpeed		= 0;
	this.prevTime		= 0;
	this.elapsedTime	= 0;

	this.ballMoveCategory = -1;
	
	this.isShownLargeGold = false;
	
	
		
	this.decreaseTime 	= 0;
	this.ballMoveRadius = 0;
	this.ballMoveStatus = 0;
	this.ballMoveTime	= 0;
	this.ballJumpTime	= 0;
	this.ballRotateTime	= 0;
	

	
	var self = this;

	// spin button click event
	$('#btn_spin').on('vclick', function(evt) {
		if ($('#win_popup').is(':visible') || $('#btn_spin').hasClass('disable')|| $('#help').hasClass('active') || self.option_status == 1)
			return;
			
		if (self.gameState != GameMain.GAME_BETTING)
			return;
	
		if ($('#btn_spin').hasClass('disable') == false) {
			self.wheel.init();
			self.clearLastGame();
			self.changeGameState(GameMain.GAME_DEALING);
			if(localStorage.getItem('effectSetting') == ''){
				if(GameMain.oSound != null) GameMain.oSound.destruct();
				GameMain.oSound = soundManager.createSound({
	      		id: 'bSound',
	      		url: 'audio/menu_on.mp3',
	      		loops:1,
	      		autoPlay:true,
	      		volume: localStorage.getItem('effect_volume')
	    		});
			}
			
		}
	});

	for (i = 1; i <= 20; i++)
	{
		$('#winside_' + i).hide();
	}
	
	// rebet button click event
	$('#btn_rebet').on('vclick', function(evt) {
		if ($('#win_popup').is(':visible') || $('#btn_rebet').hasClass('disable')|| $('#help').hasClass('active') || self.option_status == 1)
			return;
			
		if (self.gameState != GameMain.GAME_BETTING)
			return;
			
		self.clearLastGame();
		self.restoreBettingData();
		self.enableSpinButton();
		self.enableClearButton();
		if(localStorage.getItem('effectSetting') == ''){
			if(GameMain.oSound != null) GameMain.oSound.destruct();
			GameMain.oSound = soundManager.createSound({
      		id: 'cSound',
      		url: 'audio/menu_on.mp3',
      		loops:1,
      		autoPlay:true,
      		volume: localStorage.getItem('effect_volume')
    		});
		}
		
	});

	// regame button click event
	$('#btn_regame').on('vclick', function(evt) {
		if ($('#win_popup').is(':visible') || $('#btn_regame').hasClass('disable')|| $('#help').hasClass('active') || self.option_status == 1)
			return;
			
		if (self.gameState != GameMain.GAME_BETTING)
			return;
			
		//self.clearLastGame();
		self.restoreBettingData();
		self.wheel.init();
		self.clearLastGame();
		self.changeGameState(GameMain.GAME_DEALING);
		if(localStorage.getItem('effectSetting') == ''){
			if(GameMain.oSound != null) GameMain.oSound.destruct();
			GameMain.oSound = soundManager.createSound({
      		id: 'dSound',
      		url: 'audio/menu_on.mp3',
      		loops:1,
      		autoPlay:true,
      		volume: localStorage.getItem('effect_volume')
    		});
		}
		
	});

	//auto_regame button click event
	$('#btn_auto_regame').on('vclick', function(evt) {
		self.auto_setting = 1;
		$('#btn_regame').trigger('vclick');
	});

	//return button click event
	$('#btn_return').on('vclick', function(evt) {
		if($(this).hasClass('disable')) return;
		self.auto_setting = 0;
		console.log(infinite_play);
		clearTimeout(infinite_play);
		//$('#btn_regame').unbind('vclick');
	});

	// clear button click event
	$('#btn_clear').on('vclick', function(evt) {
		if ($('#win_popup').is(':visible') || $('#btn_clear').hasClass('disable')|| $('#help').hasClass('active') || self.option_status == 1)
			return;
		if (self.gameState != GameMain.GAME_BETTING)
			return;
			
		self.clearLastGame();
		self.clearBettingData();
		self.enableSpinButton();
		self.enableClearButton();
		self.enableRebetButton();
		console.log(self.option_status);
		if(localStorage.getItem('effectSetting') == ''){
			if(GameMain.oSound != null) GameMain.oSound.destruct();
			GameMain.oSound = soundManager.createSound({
      		id: 'eSound',
      		url: 'audio/menu_on.mp3',
      		loops:1,
      		autoPlay:true,
      		volume: localStorage.getItem('effect_volume')
    		});
		}
		
	});

		$('#btn_spin').on('mousedown', function(evt) {
			if(!$('#btn_spin').hasClass('disable'))
			$('#btn_spin').attr('src','img/button_spin_hover.png');
		});	
		$('#btn_spin').on('mouseup', function(evt) {
			if(!$('#btn_spin').hasClass('disable'))
			$('#btn_spin').attr('src','img/button_spin_normal.png');
		});	

		$('#btn_rebet').on('mousedown', function(evt) {
			if(!$('#btn_rebet').hasClass('disable'))
			$('#btn_rebet').attr('src','img/button_rebet_hover.png');
		});	
		$('#btn_rebet').on('mouseup', function(evt) {
			if(!$('#btn_rebet').hasClass('disable'))
			$('#btn_rebet').attr('src','img/button_rebet_normal.png');
		});	

		$('#btn_regame').on('mousedown', function(evt) {
			if(!$('#btn_regame').hasClass('disable'))
			$('#btn_regame').attr('src','img/button_regame_hover.png');
		});	
		$('#btn_regame').on('mouseup', function(evt) {
			if(!$('#btn_regame').hasClass('disable'))
			$('#btn_regame').attr('src','img/button_regame_normal.png');
		});	

		$('#btn_auto_regame').on('mousedown', function(evt) {
			if(!$('#btn_auto_regame').hasClass('disable'))
			$('#btn_auto_regame').attr('src','img/button_autoregame_hover.png');
		});	
		$('#btn_auto_regame').on('mouseup', function(evt) {
			if(!$('#btn_auto_regame').hasClass('disable'))
			$('#btn_auto_regame').attr('src','img/button_autoregame_normal.png');
		});	

		$('#btn_return').on('mousedown', function(evt) {
			if(!$('#btn_return').hasClass('disable'))
			$('#btn_return').attr('src','img/button_return_hover.png');
		});	
		$('#btn_return').on('mouseup', function(evt) {
			if(!$('#btn_return').hasClass('disable'))
			$('#btn_return').attr('src','img/button_return_normal.png');
		});	

		$('#btn_clear').on('mousedown', function(evt) {
			if(!$('#btn_clear').hasClass('disable'))
			$('#btn_clear').attr('src','img/button_clearbet_hover.png');
		});	
		$('#btn_clear').on('mouseup', function(evt) {
			if(!$('#btn_clear').hasClass('disable'))
			$('#btn_clear').attr('src','img/button_clearbet_normal.png');
		});	
		

	//game method select
	$('#american').on('vclick', function(evt) {
		if (self.gameMethod == 0|| $('#help').hasClass('active') || self.option_status == 1 || $('#wheel_show').is(':visible'))
			return;
		else
		{
			$('#european').attr('src','img/european_normal.png');
			$('#even').attr('src','img/even_normal.png');
			$('#american').attr('src','img/american_active.png');
			self.enableAmericanButton();
			self.initButtonDatas();
			self.gamePanel();
			self.wheel.loadResources();
			self.cleanBettingData();
			self.clearBettingData();
			self.enableRebetButton();
			self.enableSpinButton();
			self.enableClearButton();
			if(localStorage.getItem('effectSetting') == ''){
				if(GameMain.oSound != null) GameMain.oSound.destruct();
				GameMain.oSound = soundManager.createSound({
		      		id: 'cSound',
		      		url: 'audio/menu_on.mp3',
		      		loops:1,
		      		autoPlay:true,
		      		volume: localStorage.getItem('effect_volume')
		    		});
				
			}
			}
	});

	$('#european').on('vclick', function(evt) {
		if (self.gameMethod == 1|| $('#help').hasClass('active') || self.option_status == 1 || $('#wheel_show').is(':visible'))
			return;
		else
		{
			$('#american').attr('src','img/american_normal.png');
			$('#even').attr('src','img/even_normal.png');
			$('#european').attr('src','img/european_active.png');
			self.enableEuropeanButton();
			self.initButtonDatas();
			self.gamePanel();
			self.wheel.loadResources();
			self.cleanBettingData();
			self.clearBettingData();
			self.enableRebetButton();
			self.enableSpinButton();
			self.enableClearButton();
			if(localStorage.getItem('effectSetting') == ''){
				if(GameMain.oSound != null) GameMain.oSound.destruct();
				GameMain.oSound = soundManager.createSound({
		      		id: 'cSound',
		      		url: 'audio/menu_on.mp3',
		      		loops:1,
		      		autoPlay:true,
		      		volume: localStorage.getItem('effect_volume')
		    		});
				
			}
		}
	});

	$('#even').on('vclick', function(evt) {
		if (self.gameMethod == 2|| $('#help').hasClass('active') || self.option_status == 1 || $('#wheel_show').is(':visible'))
			return;
		else
		{
			$('#american').attr('src','img/american_normal.png');
			$('#european').attr('src','img/european_normal.png');
			$('#even').attr('src','img/even_active.png');
			self.enableEvenButton();
			self.initButtonDatas();
			self.gamePanel();
			self.wheel.loadResources();
			self.cleanBettingData();
			self.clearBettingData();
			self.enableRebetButton();
			self.enableSpinButton();
			self.enableClearButton();
			if(localStorage.getItem('effectSetting') == ''){
				if(GameMain.oSound != null) GameMain.oSound.destruct();
				GameMain.oSound = soundManager.createSound({
		      		id: 'cSound',
		      		url: 'audio/menu_on.mp3',
		      		loops:1,
		      		autoPlay:true,
		      		volume: localStorage.getItem('effect_volume')
		    		});
				
			}
		}
	});

	$('#wheel').on('vclick', function(evt) {
		if ( $('#help').hasClass('active') || self.option_status == 1)
			return;
		self.show_wheel();
	});

		$('#wheel').on('mousedown', function(evt) {
			if (!$('#wheel').hasClass('disable'))
				$('#wheel').attr('src','img/wheel_hover.png');
		});	

	$('#option').on('vclick', function(evt) {
		if ( $('#help').hasClass('active'))
			return;
		self.show_option();
	});
		//eliminate phenomenon of oscillating
		$('#option').on('mousedown', function(evt) {
			$(this).attr('src','img/OPTION_hover.png');
		});

		$('#option').on('mouseup', function(evt) {
			$(this).attr('src','img/OPTION_normal.png');
		});

	$('#help').on('vclick', function(evt) {
		if ( self.option_status == 1 || $('#wheel').hasClass('disable'))
			return;
		self.enable_help();
	});

	$('#back_setting').on('vclick', function(evt) {
		!localStorage.getItem('backSetting') ? localStorage.setItem('backSetting' , 'muted') : localStorage.setItem('backSetting' , '');
		if(localStorage.getItem('backSetting') == '') 
		{
			$('#back_setting').css('width', '36px');
			$('#back_setting').css('background-image', 'url(img/music_on.png)');
			mySound.play();
		}
		else
		{
			$('#back_setting').css('width', '43px');
			$('#back_setting').css('background-image', 'url(img/music_off.png)');
			$('#back_music audio').attr('muted','');
			mySound.pause();
		}
	});

	$("#repeat").click(function(){
    	if($(this).attr('checked')){
    		localStorage.setItem('method','repeat');
    		mySound.destruct();
		var music_repeat = function(){
				clearTimeout();
				mySound = soundManager.createSound({
		      	id: 'bdSound',
		      	url: 'audio/background.mp3',
		      	loops:1,
		      	volume: localStorage.getItem('bgm_volume')
		   		});
		   		if(localStorage.getItem('backSetting') == '')
    				mySound.play();

		    	setTimeout(function(){
		    		mySound.destruct();
		    		mySound = soundManager.createSound({
			      	id: 'bfSound',
			      	url: 'audio/Crossroads.mp3',
			      	loops:1,
			      	volume: localStorage.getItem('bgm_volume')
			   		});
			   		if(localStorage.getItem('backSetting') == '')
    					mySound.play();
		    	},155000);
		    	
		    	setTimeout(function(){
		    		mySound.destruct();
		    		mySound = soundManager.createSound({
			      	id: 'cdSound',
			      	url: 'audio/Track02.mp3',
			      	loops:1,
			      	volume: localStorage.getItem('bgm_volume')
			   		});
			   		if(localStorage.getItem('backSetting') == '')
    					mySound.play();
		    	},350000);

		    	setTimeout(function(){
		    		mySound.destruct();
		    	},560000);
		    };
			music_repeat();
			setTimeout(music_repeat,1120000);
			setTimeout(music_repeat,1680000);
			setTimeout(music_repeat,2240000);
    	}
    	else{
    		localStorage.setItem('method', '');
    		mySound.destruct();
    		mySound = soundManager.createSound({
	      		id: 'aSound',
	      		url: 'audio/'+localStorage.getItem('musicSource'),
	      		loops:1000,
	      		volume: localStorage.getItem('bgm_volume')
	    	});
	    	if(localStorage.getItem('backSetting') == '')
    		mySound.play();
    	}
    });

	$('#effect_setting').on('vclick', function(evt) {
		!localStorage.getItem('effectSetting') ? localStorage.setItem('effectSetting' , 'muted') : localStorage.setItem('effectSetting' , '');
		if(localStorage.getItem('effectSetting') == '') 
		{
			$('#effect_setting').css('width', '36px');
			$('#effect_setting').css('background-image', 'url(img/music_on.png)');
			//$('#back_music audio').removeAttr('muted');
		}
		else
		{
			$('#effect_setting').css('width', '43px');
			$('#effect_setting').css('background-image', 'url(img/music_off.png)');
			//$('#back_music audio').attr('muted','');
		}
	});

	$('#option_ok').on('vclick', function(evt) {
		self.hide_option();
	});

	$('#select').on('change', function(evt) {
		localStorage.setItem('musicSource' , $(this).val());
		mySound.destruct();
			soundManager.setup({
 		url: 'swf/',
  		onready: function() {

    	mySound = soundManager.createSound({
      		id: 'aSound',
      		url: 'audio/'+localStorage.getItem('musicSource'),
      		loops:1000,
      		volume: localStorage.getItem('bgm_volume')
    	});
    	if(localStorage.getItem('backSetting') == '')
    		mySound.play();
  		},
  		ontimeout: function() {
    	// Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?
  		}
	});
		
	});

	// initialize the chip text.	
	for (i = 0; i < 3; i++) {
		$('#chip_' + (i + 1) + ' span').html(Game.BettingAmounts[i]);
		$('#chip_' + (i + 1) + ' span').css('color', Game.chipDatas[i][4]);
	}
	
	// initialize the chip position.
	Game.selectChip(0, 200);
	
	// check the enable or disable status of Spin, Clear, Rebet buttons.
	this.enableSpinButton();
	this.enableClearButton();
	this.enableRebetButton();
	this.enableReturnButton();
	this.enableMusic();

	
	this.touchEvent	= new MotionEvent();
	
	this.updateWinNumber();
}

// current string used on the game
Game.Currency			= '';

// initial amount of each user
Game.INITIAL_MONEY 		= 0;

// button start index and count
Game.BETBOARD_INDEX		= 0;

// dimension of sliding chip image
Game.CHIP_WIDTH			= 54;
Game.CHIP_HEIGHT		= 54;

// dimension of board chip image
Game.BOARD_CHIP_WIDTH	= 20;
Game.BOARD_CHIP_HEIGHT	= 20;

// dimension of ball image
Game.BALL_WIDTH			= 21;
Game.BALL_HEIGHT		= 21;
Game.BALL_MOVERADIUS	= 260;

// betting amounts at a time
Game.BettingAmounts		= [1, 5, 10];

// speed to rotate the panel.
Game.INIT_SPEED			= 120;
Game.ACCE_SPEED			= 20;
Game.BALL_SPEED			= 150;
Game.BALL_ACCESPEED		= 100;

// panel number data
Game.PANEL_NUMBER_COUNT	= 37;
Game.PANEL_NUMBERS		= [
								0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
								5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
						];

Game.SelBoardInfos = [];
Game.roulette_numbers = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26]; 

Game.MAX_WINNUMBER_COUNT = 9;

// time to show the winning number
Game.WINNING_CHANGETIME	= 200;
Game.WINNING_SHOWTIME	= 3000;
Game.BALLFALL_TIME		= 1000;


// board cell indices for round cell.
Game.roundValues = [
	[55, 90, 63, 99, 77, 83],
	[0, 56, 64, 67, 81],
	[49, 54, 62, 68, 69, 75, 76, 82],
	[50, 62, 25, 82]
];

// information for sliding 3 chips
Game.chipDatas = [
	[30, -8, 90, 106, 'rgba(139, 9, 194, 1)', 27, 26],
	[100, -14, 102, 117, 'rgba(10, 107, 3, 1)', 30, 30],
	[170, -8, 90, 106, 'rgba(0, 0, 0, 1)', 27, 26]
	
];

// maximum count of chip which can be put on each cell.
Game.MAX_BOARCHIP_COUNT = 10;

// variables to implement the sliding.
Game.isMouseDown = false;
Game.oldChipMousePos = [0];
Game.curChipMousePos = [0];
Game.startChipIndex = 0;
Game.isClickedChipItem = 0;
Game.chipDir = [0, 0, 0];
Game.chip_PositionArray = [1 , 2, 3];

// Mouse down handler for sliding chips
Game.onMouseDown = function() {
	Game.isMouseDown = true;
	
	// save the mouse position
	Game.oldChipMousePos[0] = Game.curChipMousePos[0];
	Game.oldChipMousePos[1] = Game.curChipMousePos[1];
	
	Game.isClickedChipItem = Game.getChipIndex_FromMousePoint(Game.oldChipMousePos[0]);
	
	Game.chipDir = [1, 2, 3];
};

// get the index of current selected chip.
Game.getChipIndex_FromMousePoint = function(mousePos)
{
	for(var i = 0; i< 2; i++)
	{
		if(mousePos > Game.chipDatas[i][0] && mousePos < Game.chipDatas[i+1][0])
			return i + 1;
		if(mousePos > Game.chipDatas[2][0] && mousePos < Game.chipDatas[2][0] + 70)
			return 3;
	}
	return -1;
}

// variables to move the chips.
Game.moveRatio = [1, 1.5,2]
Game.moveDirection = 1;

// Mouse move event handler
Game.onMouseMove = function() {
	if (Game.isMouseDown)
	{
		if (Game.oldChipMousePos[0] != Game.curChipMousePos[0])
		{
			// get the current selected chip.
			var currentPositionIndex = Game.getChipIndex_FromMousePoint(Game.curChipMousePos[0]);
			if(currentPositionIndex == -1)
				return;
			var stepX = Game.curChipMousePos[0] - Game.oldChipMousePos[0];
			
			// check the direction of sliding.
			// move all chips to the current mov direction.
			if(Game.isClickedChipItem > currentPositionIndex)
			{
				Game.isClickedChipItem  = currentPositionIndex;
				Game.startChipIndex = (Game.startChipIndex+2)%3;
				for(var loopIndex = 0; loopIndex < 3; loopIndex++)
				{
					Game.chip_PositionArray[loopIndex] = (Game.chip_PositionArray[loopIndex]+2) % 3;
					if(Game.chip_PositionArray[loopIndex] == 0)
						Game.chip_PositionArray[loopIndex] = 3;
				}
				Game.selectChip((Game.startChipIndex + 1) % 3, 300);
			}
			else if(Game.isClickedChipItem < currentPositionIndex)
			{
				Game.isClickedChipItem  = currentPositionIndex;
				Game.startChipIndex = (Game.startChipIndex+2)%3;

				for(var loopIndex = 0; loopIndex < 3; loopIndex++)
				{
					Game.chip_PositionArray[loopIndex] = (Game.chip_PositionArray[loopIndex] + 2) % 3;
					if(Game.chip_PositionArray[loopIndex] == 0)
						Game.chip_PositionArray[loopIndex] = 3;
				}
				Game.selectChip((Game.startChipIndex ) % 3, 300);
			}
			
			/*for(var loopIndex = 0; loopIndex < 5; loopIndex++)
			{
				
				index = Game.chip_PositionArray[loopIndex];
				
				/*if(stepX > 0)
				{
					//if(Game.moveDirection == 0)
					//	Game.selectChip((Game.startChipIndex + 2) % 5, 300);
					if(loopIndex == 4)
					{
						left = parseInt($('#chip_' + Game.chip_PositionArray[4]).css('left'));
						left -= (stepX * 0.5 );
						$('#chip_' + Game.chip_PositionArray[4]).css('left', left + 'px');
					}
					else
					{
						left = parseInt($('#chip_' + (Game.chip_PositionArray[loopIndex])).css('left'));
						
						left += (stepX);
						if(Math.abs(stepX) < 15 && left <370 && left > 0)
						{
							$('#chip_' + Game.chip_PositionArray[loopIndex]).css('left', left + 'px');
						}
						//	Game.updateChip(Game.chip_PositionArray[loopIndex], left, stepX);
					}
					Game.moveDirection = 1;
				}
				else if(stepX < 0)
				{
					//if(Game.moveDirection == 1)
					//	Game.selectChip((Game.startChipIndex + 2) % 5, 300);
					if(loopIndex == 0)
					{
						left = parseInt($('#chip_' + Game.chip_PositionArray[0]).css('left'));
						left += (Math.abs(stepX) * 0.5);
						$('#chip_' +  Game.chip_PositionArray[0]).css('left', left + 'px');
					}
					else
					{
						left = parseInt($('#chip_' + (Game.chip_PositionArray[loopIndex])).css('left'));
					
						left += (stepX);
						
						if(Math.abs(stepX) < 15 && left <370 && left > 0)
						{
							$('#chip_' + Game.chip_PositionArray[loopIndex]).css('left', left + 'px');
						}
						//	Game.updateChip(Game.chip_PositionArray[loopIndex], left, stepX);
					}
					Game.moveDirection = 0;
				}
			}*/
			Game.oldChipMousePos[0] = Game.curChipMousePos[0];
			Game.oldChipMousePos[1] = Game.curChipMousePos[1];

			/*var i = 0, idx = 0, bidx = 0;
			var left = 0;
			var enIndex = (Game.startChipIndex + 4) % 5;
			
			for (i = 0; i < 5; i++)
			{
				idx = (Game.startChipIndex + i) % 5;
			
				left = parseInt($('#chip_' + (idx + 1)).css('left'));
				
				left += Game.chipDir[idx] * stepX;
				
				Game.updateChip(idx + 1, left, stepX);
			}
			
			if (stepX < 0)
			{
				// 1st chip
				idx  = Game.startChipIndex;
				left = parseInt($('#chip_' + (idx + 1)).css('left'));
				if (left < Game.chipDatas[0][0])
				{
					console.log("dir -- " + idx + " : " + Game.chipDir[idx]);
					Game.chipDir[idx] = -1 * Game.chipDir[idx];
					$('#chip_' + (idx + 1)).css('left', Game.chipDatas[0][0] + 'px');
					
					idx = (Game.startChipIndex + 4) % 5;
					Game.chipDir[idx] = 1;
					$('#chip_' + (idx + 1)).css('left', Game.chipDatas[4][0] + 'px');
				}
				
				// 2nd chip
				idx  = (Game.startChipIndex + 1) % 5;
				left = parseInt($('#chip_' + (idx + 1)).css('left'));
				if (left < (Game.chipDatas[0][0] + Game.chipDatas[1][0]) / 2)
				{
					Game.startChipIndex = (Game.startChipIndex + 1) % 5;
				}
			}
			else
			{
				// 5th chip
				idx  = (Game.startChipIndex + 4) % 5;
				left = parseInt($('#chip_' + (idx + 1)).css('left'));
				if (left > Game.chipDatas[4][0])
				{
					Game.chipDir[idx] = -1 * Game.chipDir[idx];
					$('#chip_' + (idx + 1)).css('left', Game.chipDatas[4][0] + 'px');
					
					idx = Game.startChipIndex;
					Game.chipDir[idx] = 1;
					$('#chip_' + (idx + 1)).css('left', Game.chipDatas[0][0] + 'px');
				}
				
				// 4th chip
				idx  = (Game.startChipIndex + 3) % 5;
				left = parseInt($('#chip_' + (idx + 1)).css('left'));
				if (left > (Game.chipDatas[3][0] + Game.chipDatas[4][0]) / 2)
				{
					Game.startChipIndex = (Game.startChipIndex + 4) % 5;
				}
			}*/
			
			/*for (i = 0; i < 5; i++)
			{
				idx  = (Game.startChipIndex + i) % 5;
				left = parseInt($('#chip_' + (idx + 1)).css('left'));
				
				if (left < Game.chipDatas[0][0])
				{
					Game.chipDir[idx] = -1 * Game.chipDir[idx];
					$('#chip_' + (idx + 1)).css('left', Game.chipDatas[0][0] + 'px');
				}
				else if (left > Game.chipDatas[4][0])
				{
					Game.chipDir[idx] = -1 * Game.chipDir[idx];
					$('#chip_' + (idx + 1)).css('left', Game.chipDatas[4][0] + 'px');
				}
				
				if (Game.chipDir[idx] == -1)
					$('#chip_' + (idx + 1)).css('z-index', 9000);
				else
					$('#chip_' + (idx + 1)).css('z-index', (10000 + 2 - Math.abs(2 - i)));
			}*/
			
			
		}
	}
};

// Mouse up event handler.
Game.onMouseUp = function() {
	Game.isMouseDown = false;
	Game.selectChip((Game.startChipIndex + 0) % 3, 300);
};

// update the chip information(position, size, text, etc)
Game.updateChip = function(idx, left, step)
{
	$('#chip_' + idx).css('left', left + 'px');
	
	if (Game.chipDir[idx - 1] == -1)
	{
		$('#chip_' + idx).css('z-index', 9000);
		return;
	}

	var i = 0;
	
	for (i = 0; i < 2; i++)
	{
		if (left >= Game.chipDatas[i][0] && left < Game.chipDatas[i + 1][0])
		{
			var factor = (left - Game.chipDatas[i][0]) / (Game.chipDatas[i + 1][0] - Game.chipDatas[i][0]);
			
			$('#chip_' + idx).css('top', (Game.chipDatas[i][1] * (1 - factor) + factor * Game.chipDatas[i + 1][1]) + 'px');
			$('#chip_' + idx).css('width', (Game.chipDatas[i][2] * (1 - factor) + factor * Game.chipDatas[i + 1][2]) + 'px');
			$('#chip_' + idx).css('height', (Game.chipDatas[i][3] * (1 - factor) + factor * Game.chipDatas[i + 1][3]) + 'px');
			
			$('#chip_' + idx + ' span').css('top', (Game.chipDatas[i][5] * (1 - factor) + factor * Game.chipDatas[i + 1][5]) + 'px');
			$('#chip_' + idx + ' span').css('font-size', (Game.chipDatas[i][6] * (1 - factor) + factor * Game.chipDatas[i + 1][6]) + 'px');
					
			break;
		}
	}
}

// select a specified chip.
Game.selectChip = function(chip_id, interval)
{
	var i = 0, idx;
	
	Game.startChipIndex = (chip_id - 2+ 3) % 3;
	
	for (i = 0; i < 3; i++) {
		idx = (chip_id - 1 + i + 3) % 3; 
		$('#chip_' + (idx + 1)).css('z-index', (10000 + 1 - Math.abs(1 - i)));

		$("#chip_" + (idx + 1)).animate({
			'left': 	Game.chipDatas[i][0],
			'top': 		Game.chipDatas[i][1],
			'width': 	Game.chipDatas[i][2],
			'height': 	Game.chipDatas[i][3],
			'z-index':	(10000 + 1 - Math.abs(1 - i))
		}, interval, function(_idx, _i) {
		}.bind(null, idx, i));
		
		$("#chip_" + (idx + 1) + ' span').animate({
			'top':			Game.chipDatas[i][5],
			'font-size':	Game.chipDatas[i][6]
		}, interval, function() {
		
		});
	}
	
	Game.curBettingAmountIndex = chip_id;
}

// initialize the data for betting board cells.
Game.prototype.initButtonDatas = function()
{	
	//european method betting data
	if (this.gameMethod == 1)
	{
		// indices for betting area
		Game.INDEX_2TO1 		= 36;
		Game.INDEX_SEQ12		= Game.INDEX_2TO1 + 3;
		Game.INDEX_1TO18		= Game.INDEX_SEQ12 + 3;
		Game.INDEX_EVEN			= Game.INDEX_1TO18 + 1;
		Game.INDEX_RED			= Game.INDEX_1TO18 + 2;
		Game.INDEX_BLACK		= Game.INDEX_1TO18 + 3;
		Game.INDEX_ODD			= Game.INDEX_1TO18 + 4;
		Game.INDEX_19TO36		= Game.INDEX_1TO18 + 5;
		Game.INDEX_2NUMBERS		= Game.INDEX_1TO18 + 6;

		Game.INDEX_4NUMBERS		= Game.INDEX_2NUMBERS + 36 + 24;

		Game.INDEX_0			= Game.INDEX_4NUMBERS + 22;

		Game.BETBOARD_COUNT		= Game.INDEX_0 + 1;
		Game.TOTALBUTTON_COUNT	= Game.BETBOARD_COUNT;
		this.bettingInfos		= new Array(Game.BETBOARD_COUNT);
		this.bettingCounts		= new Array(Game.BETBOARD_COUNT);
		this.oldBettingInfos	 = new Array(Game.BETBOARD_COUNT);
		this.oldBettingCounts	 = new Array(Game.BETBOARD_COUNT);
		
		for (i = 0; i < Game.BETBOARD_COUNT; i++)
		{
			this.bettingInfos[i]  = [];
			this.bettingCounts[i] = 0;
		}
		
		// betting history
		
		for (i = 0; i < Game.BETBOARD_COUNT; i++)
		{
			this.oldBettingInfos[i]  = [];
			this.oldBettingCounts[i] = 0;
		}
	
		

		Game.SelBoardInfos = [];
	
		var count = 0;
		// 2 to 1
		for (i = 0; i < 3; i++)
		{
			Game.SelBoardInfos[count] = [];
			for (j = 0; j < 12; j++)
				Game.SelBoardInfos[count][j] = i + 1 + 3 * j;
			count++;
		}	
		
		// 1st 12, 2nd 12, 3rd 12
		for (i = 0; i < 3; i++)
		{
			Game.SelBoardInfos[count] = [];
			for (j = 0; j < 12; j++)
				Game.SelBoardInfos[count][j] = i * 12 + j + 1;
			count++;
		}
		
		// 1 to 18
		Game.SelBoardInfos[count] = [];
		for (i = 0; i < 18; i++)
			Game.SelBoardInfos[count][i] = i + 1;
		count++;
		
		// even
		Game.SelBoardInfos[count] = [];
		for (i = 0; i < 18; i++)
			Game.SelBoardInfos[count][i] = (i + 1) * 2;
		count++;
		
		// red
		Game.SelBoardInfos[count] = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
		count++;
		
		// black
		Game.SelBoardInfos[count] = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
		count++;
		
		// odd
		Game.SelBoardInfos[count] = [];
		for (i = 0; i < 18; i++)
			Game.SelBoardInfos[count][i] = i * 2 + 1;
		count++;
		
		// 19 to 36
		Game.SelBoardInfos[count] = [];
		for (i = 0; i < 18; i++)
			Game.SelBoardInfos[count][i] = i + 19;
		count++;
		
		// vertical 2 numbers
		for (i = 0; i < 36; i++) {
			Game.SelBoardInfos[count] = [];
			Game.SelBoardInfos[count][0] = i + 1;
			if (i < 3)
				Game.SelBoardInfos[count][1] = Game.INDEX_0 + 1;
			else
				Game.SelBoardInfos[count][1] = i - 2;
			
			count++;
		}
		
		// horizontal 2 numbers
		for (i = 0; i < 24; i++) {
		idx = parseInt(i / 2) * 3 + (i % 2) + 1;
		
			Game.SelBoardInfos[count] = [];
			Game.SelBoardInfos[count][0] = idx;
			Game.SelBoardInfos[count][1] = idx + 1;
			
			count++;
		}
		
		// 4 numbers
		var idx;
		
		for (i = 0; i < 22; i++) {
			idx = parseInt(i / 2) * 3 + (i % 2) + 1;
		
			Game.SelBoardInfos[count] = [];
			Game.SelBoardInfos[count][0] = idx;
			Game.SelBoardInfos[count][1] = idx + 1;
			Game.SelBoardInfos[count][2] = idx + 3;
			Game.SelBoardInfos[count][3] = idx + 4;
			
			count++;
		}
		//buttondata 
		var i = 0, count = 0;
		var w, h, idx;

		this.buttonDatas = [];
		
		// 1 ~ 39, 2 to 1
		for (i = 0; i < 39; i++) {
			this.buttonDatas[4 * count] = 92 + parseInt(i / 3) * 66.7;
			this.buttonDatas[4 * count + 1] = 230 - (i % 3) * 102;	
			if (i < 36)
				this.buttonDatas[4 * count + 2] = 64;
			else
				this.buttonDatas[4 * count + 2] = 54;
			this.buttonDatas[4 * count + 3] = 100;
			
			count++;
		}
		
		// 1st 12, 2nd 12, 3rd 12
		for (i = 0; i < 3; i++) {
			this.buttonDatas[4 * count] = 94 + i * 267;
			this.buttonDatas[4 * count + 1] = 330;
			this.buttonDatas[4 * count + 2] = 265;
			this.buttonDatas[4 * count + 3] = 40;
			
			count++;
		}
		
		// 1 to 18, even, red, black, odd, 19 to 36
		var xx = 89, ww = 0;
		for (i = 0; i < 6; i++) {
			switch (i) {
				case 0:
					ww = 151;
					break;
					
				case 1:
					ww = 111;
					break;
				
				case 2:
					ww = 131;
					break;
					
				case 3:
					ww = 131;
					break;
					
				case 4:
					ww = 128;
					break;
				
				case 5:
					ww = 133;
					break;
			}
			
			this.buttonDatas[4 * count] = xx;
			this.buttonDatas[4 * count + 1] = 374;
			this.buttonDatas[4 * count + 2] = ww;
			this.buttonDatas[4 * count + 3] = 60;
			
			xx += ww + 3;
			count++;
		}
		
		// vertical 2 numbers
		w = 24; h = 108;
		
		for (i = 0; i < 36; i++) {
			this.buttonDatas[4 * count] = this.buttonDatas[4 * i] - w / 2 - 2;
			this.buttonDatas[4 * count + 1] = this.buttonDatas[4 * i + 1] + (this.buttonDatas[4 * i + 3] - h) / 2;
			this.buttonDatas[4 * count + 2] = w;
			this.buttonDatas[4 * count + 3] = h;
			
			count++;
		}
		
		// horizontal 2 numbers
		w = 58; h = 24;
		
		for (i = 0; i < 24; i++) {
			idx = parseInt(i / 2) * 3 + (i % 2);
		
			this.buttonDatas[4 * count] = this.buttonDatas[4 * idx];
			this.buttonDatas[4 * count + 1] = this.buttonDatas[4 * idx + 1] - h / 2 - 1;
			this.buttonDatas[4 * count + 2] = w;
			this.buttonDatas[4 * count + 3] = h;
			
			count++;
		}
		
		// 4 numbers
		w = 24; h = 24;
		
		for (i = 0; i < 22; i++) {
			idx = parseInt(i / 2) * 3 + (i % 2);
		
			this.buttonDatas[4 * count] = this.buttonDatas[4 * idx] + this.buttonDatas[4 * idx + 2] - w / 2 + 2;
			this.buttonDatas[4 * count + 1] = this.buttonDatas[4 * idx + 1] - h / 2 - 1;
			this.buttonDatas[4 * count + 2] = w;
			this.buttonDatas[4 * count + 3] = h;
			
			count++;
		}
		
		// 0

		this.buttonDatas[4 * count] = 34;
		this.buttonDatas[4 * count + 1] = 26;
		this.buttonDatas[4 * count + 2] = 56;
		this.buttonDatas[4 * count + 3] = 303;
		this.buttonDatas[4 * count + 4] = 13;
		this.buttonDatas[4 * count + 5] = 180;
		

		// Betting board info
		count = 0;
		
		// 1 ~ 39, 2 to 1
		this.betBoardDatas = [];
		// for (i = 0; i < 39; i++) {
		// 	this.betBoardDatas[4 * count] = 772 + (i % 3) * 53;
		// 	this.betBoardDatas[4 * count + 1] = 64 + parseInt(i / 3) * 30;	
		// 	if (i < 3)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 62 + parseInt(i / 3) * 30;
		// 	}
		// 	else if (i < 9)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 63 + parseInt(i / 3) * 30;
		// 	}
		// 	else if (i < 21 && i > 14)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 65 + parseInt(i / 3) * 30;
		// 	}
		// 	else if (i < 24 && i > 20)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 66 + parseInt(i / 3) * 30;
		// 	}
		// 	else if (i < 27 && i > 23)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 67 + parseInt(i / 3) * 30;
		// 	}
		// 	else if (i < 30 && i > 26)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 68 + parseInt(i / 3) * 30;
		// 	}
		// 	else if (i < 33 && i > 29)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 68 + parseInt(i / 3) * 30;
		// 	}
		// 	else if (i < 36 && i > 32)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 68 + parseInt(i / 3) * 30;
		// 	}
		// 	else if (i < 39 && i > 35)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 69 + parseInt(i / 3) * 30;
		// 	}
			
		// 	this.betBoardDatas[4 * count + 2] = 51;
		// 	if (i < 36)
		// 		this.betBoardDatas[4 * count + 3] = 28;
		// 	else
		// 		this.betBoardDatas[4 * count + 3] = 25;
			
		// 	count++;
		// }
		for (i = 0; i < 39; i++) {
			this.betBoardDatas[4 * count] = 774 + (i % 3) * 53;
			this.betBoardDatas[4 * count + 1] = 63 + parseInt(i / 3) * 30;	
			this.betBoardDatas[4 * count + 2] = 51;
			if (i < 36)
				this.betBoardDatas[4 * count + 3] = 28;
			else
				this.betBoardDatas[4 * count + 3] = 25;
			
			count++;
		}
		
		// 1st 12, 2nd 12, 3rd 12
		for (i = 0; i < 3; i++) {
			this.betBoardDatas[4 * count] = 751;
			this.betBoardDatas[4 * count + 1] = 62 + i * 121;
			this.betBoardDatas[4 * count + 2] = 21;
			this.betBoardDatas[4 * count + 3] = 119;
			
			count++;
		}
		
		var yy = 62, hh = 0;
		// 1 to 18, even, red, black, odd, 19 to 36
		for (i = 0; i < 6; i++) {
			switch (i) {
				case 0:
					hh = 69;
					break;
					
				case 1:
					hh = 51;
					break;
					
				case 2:
					hh = 55;
					break;
					
				case 3:
					hh = 61;
					break;
					
				case 4:
					hh = 58;
					break;
					
				case 5:
					hh = 57;
					break;
			}
		
			this.betBoardDatas[4 * count] = 719;
			this.betBoardDatas[4 * count + 1] = yy;
			this.betBoardDatas[4 * count + 2] = 32;
			this.betBoardDatas[4 * count + 3] = hh;
			
			yy += hh + 2;
			count++;
		}
		
		// vertical 2 numbers
		w = 50; h = 10;
		
		for (i = 0; i < 36; i++) {
			this.betBoardDatas[4 * count] = this.betBoardDatas[4 * i];
			this.betBoardDatas[4 * count + 1] = this.betBoardDatas[4 * i + 1] - h / 2 - 2;
			this.betBoardDatas[4 * count + 2] = w;
			this.betBoardDatas[4 * count + 3] = h;
			
			count++;
		}
		
		// horizontal 2 numbers
		w = 25; h = 25;
		
		for (i = 0; i < 24; i++) {
			idx = parseInt(i / 2) * 3 + (i % 2);
		
			this.betBoardDatas[4 * count] = this.betBoardDatas[4 * idx] + this.betBoardDatas[4 * idx + 2] - w / 2 + 1;
			this.betBoardDatas[4 * count + 1] = this.betBoardDatas[4 * idx + 1] + 1;
			this.betBoardDatas[4 * count + 2] = w;
			this.betBoardDatas[4 * count + 3] = h;
			
			count++;
		}
		
		// 4 numbers
		w = 20; h = 20;
		
		for (i = 0; i < 22; i++) {
			idx = parseInt(i / 2) * 3 + (i % 2);
		
			this.betBoardDatas[4 * count] = this.betBoardDatas[4 * idx] + this.betBoardDatas[4 * idx + 2] - w / 2 + 1;
			this.betBoardDatas[4 * count + 1] = this.betBoardDatas[4 * idx + 1] + this.betBoardDatas[4 * idx + 3] - h / 2;
			this.betBoardDatas[4 * count + 2] = w;
			this.betBoardDatas[4 * count + 3] = h;
			
			count++;
		}
		
		// 0
		this.betBoardDatas[4 * count] = 775;
		this.betBoardDatas[4 * count + 1] = 30;
		this.betBoardDatas[4 * count + 2] = 156;
		this.betBoardDatas[4 * count + 3] = 25;
		this.betBoardDatas[4 * count + 4] = 844;
		this.betBoardDatas[4 * count + 5] = 28;
	
	}
	

	//even method betting data
	if (this.gameMethod == 2)
	{
		// indices for betting area
		Game.INDEX_2TO1 		= 36;
		Game.INDEX_SEQ12		= Game.INDEX_2TO1 + 3;
		Game.INDEX_1TO18		= Game.INDEX_SEQ12 + 3;
		Game.INDEX_EVEN			= Game.INDEX_1TO18 + 1;
		Game.INDEX_RED			= Game.INDEX_1TO18 + 2;
		Game.INDEX_BLACK		= Game.INDEX_1TO18 + 3;
		Game.INDEX_ODD			= Game.INDEX_1TO18 + 4;
		Game.INDEX_19TO36		= Game.INDEX_1TO18 + 5;
		Game.INDEX_2NUMBERS		= Game.INDEX_1TO18 + 6;

		Game.INDEX_4NUMBERS		= Game.INDEX_2NUMBERS + 33 + 24;


		Game.BETBOARD_COUNT		= Game.INDEX_4NUMBERS + 22;
		Game.TOTALBUTTON_COUNT	= Game.BETBOARD_COUNT;		
		this.bettingInfos		= new Array(Game.BETBOARD_COUNT);
		this.bettingCounts		= new Array(Game.BETBOARD_COUNT);
		this.oldBettingInfos	 = new Array(Game.BETBOARD_COUNT);
		this.oldBettingCounts	 = new Array(Game.BETBOARD_COUNT);
		
		for (i = 0; i < Game.BETBOARD_COUNT; i++)
		{
			this.bettingInfos[i]  = [];
			this.bettingCounts[i] = 0;
		}
		
		// betting history
		
		for (i = 0; i < Game.BETBOARD_COUNT; i++)
		{
			this.oldBettingInfos[i]  = [];
			this.oldBettingCounts[i] = 0;
		}
			

		Game.SelBoardInfos = [];
	
		var count = 0;
		// 2 to 1
		for (i = 0; i < 3; i++)
		{
			Game.SelBoardInfos[count] = [];
			for (j = 0; j < 12; j++)
				Game.SelBoardInfos[count][j] = i + 1 + 3 * j;
			count++;
		}	
		
		// 1st 12, 2nd 12, 3rd 12
		for (i = 0; i < 3; i++)
		{
			Game.SelBoardInfos[count] = [];
			for (j = 0; j < 12; j++)
				Game.SelBoardInfos[count][j] = i * 12 + j + 1;
			count++;
		}
		
		// 1 to 18
		Game.SelBoardInfos[count] = [];
		for (i = 0; i < 18; i++)
			Game.SelBoardInfos[count][i] = i + 1;
		count++;
		
		// even
		Game.SelBoardInfos[count] = [];
		for (i = 0; i < 18; i++)
			Game.SelBoardInfos[count][i] = (i + 1) * 2;
		count++;
		
		// red
		Game.SelBoardInfos[count] = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
		count++;
		
		// black
		Game.SelBoardInfos[count] = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
		count++;
		
		// odd
		Game.SelBoardInfos[count] = [];
		for (i = 0; i < 18; i++)
			Game.SelBoardInfos[count][i] = i * 2 + 1;
		count++;
		
		// 19 to 36
		Game.SelBoardInfos[count] = [];
		for (i = 0; i < 18; i++)
			Game.SelBoardInfos[count][i] = i + 19;
		count++;
		
		// vertical 2 numbers
		for (i = 3; i < 36; i++) {
			Game.SelBoardInfos[count] = [];
			Game.SelBoardInfos[count][0] = i + 1;
			
			Game.SelBoardInfos[count][1] = i - 2;
			
			count++;
		}
		
		// horizontal 2 numbers
		for (i = 0; i < 24; i++) {
		idx = parseInt(i / 2) * 3 + (i % 2) + 1;
		
			Game.SelBoardInfos[count] = [];
			Game.SelBoardInfos[count][0] = idx;
			Game.SelBoardInfos[count][1] = idx + 1;
			
			count++;
		}
		
		// 4 numbers
		var idx;
		
		for (i = 0; i < 22; i++) {
			idx = parseInt(i / 2) * 3 + (i % 2) + 1;
		
			Game.SelBoardInfos[count] = [];
			Game.SelBoardInfos[count][0] = idx;
			Game.SelBoardInfos[count][1] = idx + 1;
			Game.SelBoardInfos[count][2] = idx + 3;
			Game.SelBoardInfos[count][3] = idx + 4;
			
			count++;
		}

		//buttondata
		var i = 0, count = 0;
		var w, h;

		this.buttonDatas = [];
		
		// 1 ~ 39, 2 to 1
		for (i = 0; i < 39; i++) {
			this.buttonDatas[4 * count] = 92 + parseInt(i / 3) * 66.6;
			this.buttonDatas[4 * count + 1] = 230 - (i % 3) * 102;	
			if (i < 36)
				this.buttonDatas[4 * count + 2] = 64.5;
			else
				this.buttonDatas[4 * count + 2] = 54;
			this.buttonDatas[4 * count + 3] = 101;
			
			count++;
		}
		
		// 1st 12, 2nd 12, 3rd 12
		for (i = 0; i < 3; i++) {
			this.buttonDatas[4 * count] = 94 + i * 267;
			this.buttonDatas[4 * count + 1] = 330;
			this.buttonDatas[4 * count + 2] = 265;
			this.buttonDatas[4 * count + 3] = 40;
			
			count++;
		}
		
		// 1 to 18, even, red, black, odd, 19 to 36
		var xx = 89, ww = 0;
		for (i = 0; i < 6; i++) {
			switch (i) {
				case 0:
					ww = 151;
					break;
					
				case 1:
					ww = 111;
					break;
				
				case 2:
					ww = 131;
					break;
					
				case 3:
					ww = 131;
					break;
					
				case 4:
					ww = 128;
					break;
				
				case 5:
					ww = 133;
					break;
			}
			
			this.buttonDatas[4 * count] = xx;
			this.buttonDatas[4 * count + 1] = 374;
			this.buttonDatas[4 * count + 2] = ww;
			this.buttonDatas[4 * count + 3] = 60;
			
			xx += ww + 3;
			count++;
		}
		
		// vertical 2 numbers
		w = 24; h = 108;
		
		for (i = 3; i < 36; i++) {
			this.buttonDatas[4 * count] = this.buttonDatas[4 * i] - w / 2 - 2;
			this.buttonDatas[4 * count + 1] = this.buttonDatas[4 * i +1] + (this.buttonDatas[4 * i +3] - h) / 2;
			this.buttonDatas[4 * count + 2] = w;
			this.buttonDatas[4 * count + 3] = h;
			
			count++;
		}
		
		// horizontal 2 numbers
		w = 58; h = 24;
		
		for (i = 0; i < 24; i++) {
			idx = parseInt(i / 2) * 3 + (i % 2);
		
			this.buttonDatas[4 * count] = this.buttonDatas[4 * idx];
			this.buttonDatas[4 * count + 1] = this.buttonDatas[4 * idx + 1] - h / 2 - 1;
			this.buttonDatas[4 * count + 2] = w;
			this.buttonDatas[4 * count + 3] = h;
			
			count++;
		}
		
		// 4 numbers
		w = 24; h = 24;
		
		for (i = 0; i < 22; i++) {
			idx = parseInt(i / 2) * 3 + (i % 2);
		
			this.buttonDatas[4 * count] = this.buttonDatas[4 * idx] + this.buttonDatas[4 * idx + 2] - w / 2 + 2;
			this.buttonDatas[4 * count + 1] = this.buttonDatas[4 * idx + 1] - h / 2 - 1;
			this.buttonDatas[4 * count + 2] = w;
			this.buttonDatas[4 * count + 3] = h;
			
			count++;
		}
		
		
		// Betting board info
		count = 0;
		
		// 1 ~ 39, 2 to 1
		this.betBoardDatas = [];
		// for (i = 0; i < 39; i++) {
		// 	this.betBoardDatas[4 * count] = 772 + (i % 3) * 53;
		// 	this.betBoardDatas[4 * count + 1] = 64 + parseInt(i / 3) * 30;	
		// 	if (i < 3)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 62 + parseInt(i / 3) * 30;
		// 	}
		// 	else if (i < 9)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 63 + parseInt(i / 3) * 30;
		// 	}
		// 	else if (i < 21 && i > 14)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 65 + parseInt(i / 3) * 30;
		// 	}
		// 	else if (i < 24 && i > 20)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 66 + parseInt(i / 3) * 30;
		// 	}
		// 	else if (i < 27 && i > 23)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 67 + parseInt(i / 3) * 30;
		// 	}
		// 	else if (i < 30 && i > 26)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 68 + parseInt(i / 3) * 30;
		// 	}
		// 	else if (i < 33 && i > 29)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 68 + parseInt(i / 3) * 30;
		// 	}
		// 	else if (i < 36 && i > 32)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 68 + parseInt(i / 3) * 30;
		// 	}
		// 	else if (i < 39 && i > 35)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 69 + parseInt(i / 3) * 30;
		// 	}
			
		// 	this.betBoardDatas[4 * count + 2] = 51;
		// 	if (i < 36)
		// 		this.betBoardDatas[4 * count + 3] = 28;
		// 	else
		// 		this.betBoardDatas[4 * count + 3] = 25;
			
		// 	count++;
		// }
		for (i = 0; i < 39; i++) {
			this.betBoardDatas[4 * count] = 774 + (i % 3) * 53;
			this.betBoardDatas[4 * count + 1] = 63 + parseInt(i / 3) * 30;	
			this.betBoardDatas[4 * count + 2] = 51;
			if (i < 36)
				this.betBoardDatas[4 * count + 3] = 28;
			else
				this.betBoardDatas[4 * count + 3] = 25;
			
			count++;
		}
		// 1st 12, 2nd 12, 3rd 12
		for (i = 0; i < 3; i++) {
			this.betBoardDatas[4 * count] = 751;
			this.betBoardDatas[4 * count + 1] = 62 + i * 121;
			this.betBoardDatas[4 * count + 2] = 21;
			this.betBoardDatas[4 * count + 3] = 119;
			
			count++;
		}
		
		var yy = 62, hh = 0;
		// 1 to 18, even, red, black, odd, 19 to 36
		for (i = 0; i < 6; i++) {
			switch (i) {
				case 0:
					hh = 69;
					break;
					
				case 1:
					hh = 51;
					break;
					
				case 2:
					hh = 54;
					break;
					
				case 3:
					hh = 63;
					break;
					
				case 4:
					hh = 58;
					break;
					
				case 5:
					hh = 57;
					break;
			}
		
			this.betBoardDatas[4 * count] = 719;
			this.betBoardDatas[4 * count + 1] = yy;
			this.betBoardDatas[4 * count + 2] = 32;
			this.betBoardDatas[4 * count + 3] = hh;
			
			yy += hh + 2;
			count++;
		}
		
		// vertical 2 numbers
		w = 50; h = 10;
		
		for (i = 3; i < 36; i++) {
			this.betBoardDatas[4 * count] = this.betBoardDatas[4 * i]+1;
			this.betBoardDatas[4 * count + 1] = this.betBoardDatas[4 * i + 1] - h / 2 - 2;
			this.betBoardDatas[4 * count + 2] = w;
			this.betBoardDatas[4 * count + 3] = h;
			
			count++;
		}
		
		// horizontal 2 numbers
		w = 25; h = 25;
		
		for (i = 0; i < 24; i++) {
			idx = parseInt(i / 2) * 3 + (i % 2);
		
			this.betBoardDatas[4 * count] = this.betBoardDatas[4 * idx] + this.betBoardDatas[4 * idx + 2] - w / 2 + 1;
			this.betBoardDatas[4 * count + 1] = this.betBoardDatas[4 * idx + 1] +1;
			this.betBoardDatas[4 * count + 2] = w;
			this.betBoardDatas[4 * count + 3] = h;
			
			count++;
		}
		
		// 4 numbers
		w = 20; h = 20;
		
		for (i = 0; i < 22; i++) {
			idx = parseInt(i / 2) * 3 + (i % 2);
		
			this.betBoardDatas[4 * count] = this.betBoardDatas[4 * idx] + this.betBoardDatas[4 * idx + 2] - w / 2 + 1;
			this.betBoardDatas[4 * count + 1] = this.betBoardDatas[4 * idx + 1] + this.betBoardDatas[4 * idx + 3] - h / 2;
			this.betBoardDatas[4 * count + 2] = w;
			this.betBoardDatas[4 * count + 3] = h;
			
			count++;
		}
		
		
	}


	//american method betting data
	if (this.gameMethod == 0)
	{
		// indices for betting area
		Game.INDEX_2TO1 		= 36;
		Game.INDEX_SEQ12		= Game.INDEX_2TO1 + 3;
		Game.INDEX_1TO18		= Game.INDEX_SEQ12 + 3;
		Game.INDEX_EVEN			= Game.INDEX_1TO18 + 1;
		Game.INDEX_RED			= Game.INDEX_1TO18 + 2;
		Game.INDEX_BLACK		= Game.INDEX_1TO18 + 3;
		Game.INDEX_ODD			= Game.INDEX_1TO18 + 4;
		Game.INDEX_19TO36		= Game.INDEX_1TO18 + 5;
		Game.INDEX_2NUMBERS		= Game.INDEX_1TO18 + 6;

		Game.INDEX_4NUMBERS		= Game.INDEX_2NUMBERS + 36 + 24;

		Game.INDEX_0			= Game.INDEX_4NUMBERS + 22;
		Game.INDEX_00			= Game.INDEX_0 + 1;

		Game.BETBOARD_COUNT		= Game.INDEX_00 + 1;
		Game.TOTALBUTTON_COUNT	= Game.BETBOARD_COUNT;

		this.bettingInfos		= new Array(Game.BETBOARD_COUNT);
		this.bettingCounts		= new Array(Game.BETBOARD_COUNT);
		this.oldBettingInfos	 = new Array(Game.BETBOARD_COUNT);
		this.oldBettingCounts	 = new Array(Game.BETBOARD_COUNT);
		
		for (i = 0; i < Game.BETBOARD_COUNT; i++)
		{
			this.bettingInfos[i]  = [];
			this.bettingCounts[i] = 0;
		}
		
		// betting history
		
		for (i = 0; i < Game.BETBOARD_COUNT; i++)
		{
			this.oldBettingInfos[i]  = [];
			this.oldBettingCounts[i] = 0;
		}
	
		

		Game.SelBoardInfos = [];
	
		var count = 0;
		// 2 to 1
		for (i = 0; i < 3; i++)
		{
			Game.SelBoardInfos[count] = [];
			for (j = 0; j < 12; j++)
				Game.SelBoardInfos[count][j] = i + 1 + 3 * j;
			count++;
		}	
		
		// 1st 12, 2nd 12, 3rd 12
		for (i = 0; i < 3; i++)
		{
			Game.SelBoardInfos[count] = [];
			for (j = 0; j < 12; j++)
				Game.SelBoardInfos[count][j] = i * 12 + j + 1;
			count++;
		}
		
		// 1 to 18
		Game.SelBoardInfos[count] = [];
		for (i = 0; i < 18; i++)
			Game.SelBoardInfos[count][i] = i + 1;
		count++;
		
		// even
		Game.SelBoardInfos[count] = [];
		for (i = 0; i < 18; i++)
			Game.SelBoardInfos[count][i] = (i + 1) * 2;
		count++;
		
		// red
		Game.SelBoardInfos[count] = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
		count++;
		
		// black
		Game.SelBoardInfos[count] = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
		count++;
		
		// odd
		Game.SelBoardInfos[count] = [];
		for (i = 0; i < 18; i++)
			Game.SelBoardInfos[count][i] = i * 2 + 1;
		count++;
		
		// 19 to 36
		Game.SelBoardInfos[count] = [];
		for (i = 0; i < 18; i++)
			Game.SelBoardInfos[count][i] = i + 19;
		count++;
		
		// vertical 2 numbers
		for (i = 0; i < 36; i++) {
			Game.SelBoardInfos[count] = [];
			Game.SelBoardInfos[count][0] = i + 1;
			if (i == 0)
				Game.SelBoardInfos[count][1] = Game.INDEX_0 + 1;
			else if(i ==1){
				Game.SelBoardInfos[count][0] = Game.INDEX_0 + 1;
				Game.SelBoardInfos[count][1] = Game.INDEX_00 + 1;
				Game.SelBoardInfos[count][2] = i + 1;
			}
			else if(i == 2)
				Game.SelBoardInfos[count][1] = Game.INDEX_00 + 1;
			else
				Game.SelBoardInfos[count][1] = i - 2;
			
			count++;
		}
		
		// horizontal 2 numbers
		for (i = 0; i < 24; i++) {
		idx = parseInt(i / 2) * 3 + (i % 2) + 1;
		
			Game.SelBoardInfos[count] = [];
			Game.SelBoardInfos[count][0] = idx;
			Game.SelBoardInfos[count][1] = idx + 1;
			
			count++;
		}
		
		// 4 numbers
		var idx;
		
		for (i = 0; i < 22; i++) {
			idx = parseInt(i / 2) * 3 + (i % 2) + 1;
		
			Game.SelBoardInfos[count] = [];
			Game.SelBoardInfos[count][0] = idx;
			Game.SelBoardInfos[count][1] = idx + 1;
			Game.SelBoardInfos[count][2] = idx + 3;
			Game.SelBoardInfos[count][3] = idx + 4;
			
			count++;
		}
		//buttondata 
		var i = 0, count = 0;
		var w, h, idx;

		this.buttonDatas = [];
		
		// 1 ~ 39, 2 to 1
		for (i = 0; i < 39; i++) {
			this.buttonDatas[4 * count] = 92 + parseInt(i / 3) * 66.7;
			this.buttonDatas[4 * count + 1] = 230 - (i % 3) * 102;	
			if (i < 36)
				this.buttonDatas[4 * count + 2] = 64;
			else
				this.buttonDatas[4 * count + 2] = 54;
			this.buttonDatas[4 * count + 3] = 100;
			
			count++;
		}
		
		// 1st 12, 2nd 12, 3rd 12
		for (i = 0; i < 3; i++) {
			this.buttonDatas[4 * count] = 94 + i * 267;
			this.buttonDatas[4 * count + 1] = 330;
			this.buttonDatas[4 * count + 2] = 265;
			this.buttonDatas[4 * count + 3] = 40;
			
			count++;
		}
		
		// 1 to 18, even, red, black, odd, 19 to 36
		var xx = 89, ww = 0;
		for (i = 0; i < 6; i++) {
			switch (i) {
				case 0:
					ww = 151;
					break;
					
				case 1:
					ww = 111;
					break;
				
				case 2:
					ww = 131;
					break;
					
				case 3:
					ww = 131;
					break;
					
				case 4:
					ww = 128;
					break;
				
				case 5:
					ww = 133;
					break;
			}
			
			this.buttonDatas[4 * count] = xx;
			this.buttonDatas[4 * count + 1] = 374;
			this.buttonDatas[4 * count + 2] = ww;
			this.buttonDatas[4 * count + 3] = 60;
			
			xx += ww + 3;
			count++;
		}
		
		// vertical 2 numbers
		w = 24; h = 108;
		
		for (i = 0; i < 36; i++) {
			this.buttonDatas[4 * count] = this.buttonDatas[4 * i] - w / 2 - 2;
			this.buttonDatas[4 * count + 1] = this.buttonDatas[4 * i + 1] + (this.buttonDatas[4 * i + 3] - h) / 2;
			this.buttonDatas[4 * count + 2] = w;
			this.buttonDatas[4 * count + 3] = h;
			
			count++;
		}
		
		// horizontal 2 numbers
		w = 58; h = 24;
		
		for (i = 0; i < 24; i++) {
			idx = parseInt(i / 2) * 3 + (i % 2);
		
			this.buttonDatas[4 * count] = this.buttonDatas[4 * idx];
			this.buttonDatas[4 * count + 1] = this.buttonDatas[4 * idx + 1] - h / 2 - 1;
			this.buttonDatas[4 * count + 2] = w;
			this.buttonDatas[4 * count + 3] = h;
			
			count++;
		}
		
		// 4 numbers
		w = 24; h = 24;
		
		for (i = 0; i < 22; i++) {
			idx = parseInt(i / 2) * 3 + (i % 2);
		
			this.buttonDatas[4 * count] = this.buttonDatas[4 * idx] + this.buttonDatas[4 * idx + 2] - w / 2 + 2;
			this.buttonDatas[4 * count + 1] = this.buttonDatas[4 * idx + 1] - h / 2 - 1;
			this.buttonDatas[4 * count + 2] = w;
			this.buttonDatas[4 * count + 3] = h;
			
			count++;
		}
		
		// 0

		this.buttonDatas[4 * count] = 34;
		this.buttonDatas[4 * count + 1] = 178;
		this.buttonDatas[4 * count + 2] = 56;
		this.buttonDatas[4 * count + 3] = 150;
		this.buttonDatas[4 * count + 4] = 13;
		this.buttonDatas[4 * count + 5] = 257;
		

		this.buttonDatas[4 * count + 6] = 34;
		this.buttonDatas[4 * count + 7] = 26;
		this.buttonDatas[4 * count + 8] = 56;
		this.buttonDatas[4 * count + 9] = 150;
		this.buttonDatas[4 * count + 10] = 13;
		this.buttonDatas[4 * count + 11] = 105;
		

		

		// Betting board info
		count = 0;
		
		// 1 ~ 39, 2 to 1
		this.betBoardDatas = [];
		
		// for (i = 0; i < 39; i++) {
		// 	this.betBoardDatas[4 * count] = 772 + (i % 3) * 53;
		// 	this.betBoardDatas[4 * count + 1] = 64 + parseInt(i / 3) * 30;	
		// 	if (i < 3)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 62 + parseInt(i / 3) * 30;
		// 	}
		// 	else if (i < 9)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 63 + parseInt(i / 3) * 30;
		// 	}
		// 	else if (i < 21 && i > 14)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 65 + parseInt(i / 3) * 30;
		// 	}
		// 	else if (i < 24 && i > 20)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 66 + parseInt(i / 3) * 30;
		// 	}
		// 	else if (i < 27 && i > 23)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 67 + parseInt(i / 3) * 30;
		// 	}
		// 	else if (i < 30 && i > 26)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 68 + parseInt(i / 3) * 30;
		// 	}
		// 	else if (i < 33 && i > 29)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 68 + parseInt(i / 3) * 30;
		// 	}
		// 	else if (i < 36 && i > 32)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 68 + parseInt(i / 3) * 30;
		// 	}
		// 	else if (i < 39 && i > 35)
		// 	{
		// 		this.betBoardDatas[4 * count + 1] = 69 + parseInt(i / 3) * 30;
		// 	}
			
		// 	this.betBoardDatas[4 * count + 2] = 51;
		// 	if (i < 36)
		// 		this.betBoardDatas[4 * count + 3] = 28;
		// 	else
		// 		this.betBoardDatas[4 * count + 3] = 25;
			
		// 	count++;
		// }
		for (i = 0; i < 39; i++) {
			this.betBoardDatas[4 * count] = 774 + (i % 3) * 53;
			this.betBoardDatas[4 * count + 1] = 63 + parseInt(i / 3) * 30;	
			this.betBoardDatas[4 * count + 2] = 51;
			if (i < 36)
				this.betBoardDatas[4 * count + 3] = 28;
			else
				this.betBoardDatas[4 * count + 3] = 25;
			
			count++;
		}
		// 1st 12, 2nd 12, 3rd 12
		for (i = 0; i < 3; i++) {
			this.betBoardDatas[4 * count] = 751;
			this.betBoardDatas[4 * count + 1] = 62 + i * 121;
			this.betBoardDatas[4 * count + 2] = 21;
			this.betBoardDatas[4 * count + 3] = 119;
			
			count++;
		}
		
		var yy = 62, hh = 0;
		// 1 to 18, even, red, black, odd, 19 to 36
		for (i = 0; i < 6; i++) {
			switch (i) {
				case 0:
					hh = 69;
					break;
					
				case 1:
					hh = 51;
					break;
					
				case 2:
					hh = 55;
					break;
					
				case 3:
					hh = 61;
					break;
					
				case 4:
					hh = 58;
					break;
					
				case 5:
					hh = 57;
					break;
			}
		
			this.betBoardDatas[4 * count] = 719;
			this.betBoardDatas[4 * count + 1] = yy;
			this.betBoardDatas[4 * count + 2] = 32;
			this.betBoardDatas[4 * count + 3] = hh;
			
			yy += hh + 2;
			count++;
		}
		
		// vertical 2 numbers
		w = 50; h = 10;
		
		for (i = 0; i < 36; i++) {
			this.betBoardDatas[4 * count] = this.betBoardDatas[4 * i];
			this.betBoardDatas[4 * count + 1] = this.betBoardDatas[4 * i + 1] - h / 2 - 2;
			this.betBoardDatas[4 * count + 2] = w;
			this.betBoardDatas[4 * count + 3] = h;
			
			count++;
		}
		
		// horizontal 2 numbers
		w = 25; h = 25;
		
		for (i = 0; i < 24; i++) {
			idx = parseInt(i / 2) * 3 + (i % 2);
		
			this.betBoardDatas[4 * count] = this.betBoardDatas[4 * idx] + this.betBoardDatas[4 * idx + 2] - w / 2 + 1;
			this.betBoardDatas[4 * count + 1] = this.betBoardDatas[4 * idx + 1] + 1;
			this.betBoardDatas[4 * count + 2] = w;
			this.betBoardDatas[4 * count + 3] = h;
			
			count++;
		}
		
		// 4 numbers
		w = 20; h = 20;
		
		for (i = 0; i < 22; i++) {
			idx = parseInt(i / 2) * 3 + (i % 2);
		
			this.betBoardDatas[4 * count] = this.betBoardDatas[4 * idx] + this.betBoardDatas[4 * idx + 2] - w / 2 + 1;
			this.betBoardDatas[4 * count + 1] = this.betBoardDatas[4 * idx + 1] + this.betBoardDatas[4 * idx + 3] - h / 2;
			this.betBoardDatas[4 * count + 2] = w;
			this.betBoardDatas[4 * count + 3] = h;
			
			count++;
		}
		
		// 0
		this.betBoardDatas[4 * count] = 774;
		this.betBoardDatas[4 * count + 1] = 32;
		this.betBoardDatas[4 * count + 2] = 78;
		this.betBoardDatas[4 * count + 3] = 25;


		//00
		this.betBoardDatas[4 * count+4] = 853;
		this.betBoardDatas[4 * count + 5] = 32;
		this.betBoardDatas[4 * count + 6] = 78;
		this.betBoardDatas[4 * count + 7] = 25;

	
	}
	//	this.panelDatas = [176, 48, 506, 506];
};

// load all resources.
Game.prototype.loadResources = function()
{
	// load the images for the board chips.
	var arrBoardChipFiles = ["board_chip_1", "board_chip_2", "board_chip_3", "chip_32"];
	
	this.imgBoardChips = new Array(arrBoardChipFiles.length);
	for (i = 0; i < arrBoardChipFiles.length; i++)
	{
		this.imgBoardChips[i] = JImage.decodeResource(arrBoardChipFiles[i]);
	}
	
	// load the image for rotate panel.
	//this.imgRotatePanel = JImage.decodeResource("rotate_panel");
	//this.imgBall	= JImage.decodeResource("ball");
	this.wheel.loadResources();
	
	// load the gold images.
	this.imgSmallGold = JImage.decodeResource("golden_chip_small");
	this.imgLargeGold = JImage.decodeResource("golden_chip_large");
};

// check and set the enable status of spin button
Game.prototype.enableSpinButton = function()
{
	if (this.totalBettingMoney == 0){
		$('#btn_spin').addClass('disable');
		$('#btn_spin').attr('src','img/button_spin_disable.png');
	}
	else{
		$('#btn_spin').removeClass('disable');
		$('#btn_spin').attr('src','img/button_spin_normal.png');
	}
}

// check and set the enable status of clear button
Game.prototype.enableClearButton = function()
{
	if (this.totalBettingMoney == 0){
		$('#btn_clear').addClass('disable');
		$('#btn_clear').attr('src','img/button_clearbet_disable.png');
	}
	else{
		$('#btn_clear').removeClass('disable');
		$('#btn_clear').attr('src','img/button_clearbet_normal.png');
	}
}

// check and set the enable status of rebet button
Game.prototype.enableRebetButton = function()
{
	var i = 0;

	for (i = 0; i <= Game.BETBOARD_COUNT; i++)
	{
		if (this.oldBettingCounts[i] > 0)
			break;
	}

	if (i >= Game.BETBOARD_COUNT)
	{
		$('#btn_rebet').addClass('disable');
		$('#btn_regame').addClass('disable');
		$('#btn_auto_regame').addClass('disable');
		$('#btn_rebet').attr('src','img/button_rebet_disable.png');
		$('#btn_regame').attr('src','img/button_regame_disable.png');
		$('#btn_auto_regame').attr('src','img/button_autoregame_disable.png');
	}
	else
	{
		$('#btn_rebet').removeClass('disable');
		$('#btn_regame').removeClass('disable');
		$('#btn_auto_regame').removeClass('disable');
		$('#btn_rebet').attr('src','img/button_rebet_normal.png');
		$('#btn_regame').attr('src','img/button_regame_normal.png');
		$('#btn_auto_regame').attr('src','img/button_autoregame_normal.png');
	}
}

Game.prototype.enableReturnButton = function()
{	
	if (this.auto_setting == 1)
	{	
		$('#btn_return').removeClass('disable');
		$('#btn_return').attr('src','img/button_return_normal.png');
	}
	else
	{	
		$('#btn_return').addClass('disable');
		$('#btn_return').attr('src','img/button_return_disable.png');
	}

}

Game.prototype.enableAmericanButton = function()
{	
	$('#method_select .active').removeClass('active');
	$('#american').addClass('active');
	this.gameMethod = 0;
	$('#bet_back').css('background-image',"url('img/betting_back_0.jpg')");
	$('#rot_back').css('background-image',"url('img/rotate_back_0.png')");
	console.log(this.gameMethod);
	this.winNumbers = new Array();
	$('.winbutton').hide();
	this.winStatus = new Array();
	this.totalMoney += this.totalBettingMoney;
	
}

Game.prototype.enableEuropeanButton = function()
{
	$('#method_select .active').removeClass('active');
	$('#european').addClass('active');
	this.gameMethod = 1;
	$('#bet_back').css('background-image',"url('img/betting_back_1.jpg')");
	$('#rot_back').css('background-image',"url('img/rotate_back_1.png')");
	console.log(this.gameMethod);
	this.winNumbers = new Array();
	$('.winbutton').hide();
	this.winStatus = new Array();
	this.totalMoney += this.totalBettingMoney;
}

Game.prototype.enableEvenButton = function()
{
	$('#method_select .active').removeClass('active');
	$('#even').addClass('active');
	this.gameMethod = 2;
	$('#bet_back').css('background-image',"url('img/betting_back_2.jpg')");
	$('#rot_back').css('background-image',"url('img/rotate_back_2.png')");	
	console.log(this.gameMethod);
	this.winNumbers = new Array();
	$('.winbutton').hide();
	this.winStatus = new Array();
	this.totalMoney += this.totalBettingMoney;
}
Game.prototype.enableMusic = function()
{
	if(!localStorage.getItem('musicSource'))
		localStorage.setItem('musicSource' , $('#select').val());
	soundManager.setup({
 		url: 'swf/',
  		onready: function() {
  		// soundManager.altURL = 'audio/background.mp3';
    	mySound = soundManager.createSound({
      		id: 'aSound',
      		url: 'audio/'+localStorage.getItem('musicSource'),
      		loops:1000,
      		volume: localStorage.getItem('bgm_volume')
    	});
    	if(localStorage.getItem('backSetting') == '')
    		mySound.play();
  		},
  		ontimeout: function() {
    	// Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?
  		}
	});
	$('#select').val(localStorage.getItem('musicSource'));
	if(!localStorage.getItem('backSetting'))
		localStorage.setItem('backSetting' , '');
	if(!localStorage.getItem('effectSetting'))
		localStorage.setItem('effectSetting' , '');
	//background sound setting
	if(localStorage.getItem('backSetting') == '') 
	{
		$('#back_setting').css('width', '36px');
		$('#back_setting').css('background-image', 'url(img/music_on.png)');
	}
	else
	{
		$('#back_setting').css('width', '43px');
		$('#back_setting').css('background-image', 'url(img/music_off.png)');
	}
	//effect sound setting
	if(localStorage.getItem('effectSetting') == '') 
	{
		$('#effect_setting').css('width', '36px');
		$('#effect_setting').css('background-image', 'url(img/music_on.png)');
	}
	else
	{
		$('#effect_setting').css('width', '43px');
		$('#effect_setting').css('background-image', 'url(img/music_off.png)');
	}
	if(!localStorage.getItem('method'))
    	localStorage.setItem('method', '');
    if(localStorage.getItem('method') == 'repeat'){
    	$('#repeat').attr('checked','checked');
    	mySound.destruct();
		for(i=0;i<100;i++){
			setTimeout(function(){
			mySound = soundManager.createSound({
	      	id: 'bdSound',
	      	url: 'audio/background.mp3',
	      	loops:1,
	      	volume: localStorage.getItem('bgm_volume')
	   		});
	   		if(localStorage.getItem('backSetting') == '')
    			mySound.play();
    		}, 560000 * i);
	    	setTimeout(function(){
	    		mySound.destruct();
	    		mySound = soundManager.createSound({
		      	id: 'bfSound',
		      	url: 'audio/Crossroads.mp3',
		      	loops:1,
		      	volume: localStorage.getItem('bgm_volume')
		   		});
		   		if(localStorage.getItem('backSetting') == '')
    			mySound.play();
	    	},155000 + 560000 * i);
	    	
	    	setTimeout(function(){
	    		mySound.destruct();
	    		mySound = soundManager.createSound({
		      	id: 'cdSound',
		      	url: 'audio/Track02.mp3',
		      	loops:1,
		      	volume: localStorage.getItem('bgm_volume')
		   		});
		   		if(localStorage.getItem('backSetting') == '')
    			mySound.play();
	    	},350000 + 560000 * i);

	    	setTimeout(function(){
	    		mySound.destruct();
	    	},559998 + 560000 * i);
	    }
    			    	
    	
    }
}

//panel total number defining
Game.prototype.gamePanel = function()
{
	if (this.gameMethod == 1)
	{
	Game.PANEL_NUMBER_COUNT	= 37;
	Game.PANEL_NUMBERS		= [
								0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
								5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
						];
	Game.roulette_numbers = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26]; 
	console.log(Game.roulette_numbers);
	}

	if (this.gameMethod == 2)
	{
	Game.PANEL_NUMBER_COUNT	= 36;
	Game.PANEL_NUMBERS		= [
								32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
								5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
						];
	Game.roulette_numbers = [32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26]; 
	console.log(Game.roulette_numbers);
	}

	if (this.gameMethod == 0)
	{
	Game.PANEL_NUMBER_COUNT	= 38;
	Game.PANEL_NUMBERS		= [
								28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36, 13, 1,
								'00', 27, 10, 25, 29, 12, 8, 19, 31, 18, 6, 21, 33, 16, 4, 23, 35, 14, 2,0
						];
	Game.roulette_numbers = [28,9,26,30,11,7,20,32,17,5,22,34,15,3,24,36,13,1,'00',27,10,25,29,12,8,19,31,18,6,21,33,16,4,23,35,14,2,0]; 
	console.log(Game.PANEL_NUMBER_COUNT);
	}
}

Game.prototype.show_wheel = function()
{	
	if ($('#win_popup').is(':visible') || $('#wheel').hasClass('disable'))
			return;
	switch (this.gameMethod)
	{
		case 0:
			$('#wheel_show').css('background-image', "url('img/look_thru_0.png')");
			break;
		case 1:
			$('#wheel_show').css('background-image', "url('img/look_thru_1.png')");
			break;
		case 2:
			$('#wheel_show').css('background-image', "url('img/look_thru_2.png')");
			break;
	}
	if(localStorage.getItem('effectSetting') == ''){
		if(GameMain.oSound != null) GameMain.oSound.destruct();
		GameMain.oSound = soundManager.createSound({
      		id: 'cSound',
      		url: 'audio/menu_on.mp3',
      		loops:1,
      		autoPlay:true,
      		volume: localStorage.getItem('effect_volume')
    		});
		
	}
		
	if($('#wheel_show').is(':visible')){
		$('#wheel_show').hide();
		if(!this.option_state)$('#wheel').removeClass('disable');
		$('#wheel').attr('src','img/wheel_normal.png');
		$('#win_history').hide();
		$('#winnumber_sidebar').hide();
	}
	else{
		$('#wheel_show').show();
		$('#win_history').show();
		$('#winnumber_sidebar').show();
	}
	
	//$('#wheel').addClass('disable');
	//$('#wheel').attr('src','img/wheel_disable.png');
	
	//setTimeout("$('#wheel_show').fadeOut(1000)",4000);
	console.log(this.option_status);
}

Game.prototype.show_option = function()
{
	if(localStorage.getItem('effectSetting') == ''){
		if(GameMain.oSound != null) GameMain.oSound.destruct();
		GameMain.oSound = soundManager.createSound({
      		id: 'cSound',
      		url: 'audio/menu_on.mp3',
      		loops:1,
      		autoPlay:true,
      		volume: localStorage.getItem('effect_volume')
    		});
		
	}
	this.option_status = 1;
 	 
 	$('#option_show').show(500);
	$('#option').addClass('active');
	console.log('dd');
	//$('#option').attr('src','img/OPTION_hover.png')
	$('#wheel').addClass('disable');
	$('#wheel').attr('src','img/wheel_disable.png');
	if($('#wheel_show').css('display') == 'none') 
 		{
 			$('#wheel').addClass('disable');
 			$('#wheel').attr('src','img/wheel_disable.png');
 			//clearInterval(option_wheel_relation);
 		}
	
	$('#btn_spin').addClass('disable');
	$('#btn_rebet').addClass('disable');
	$('#btn_regame').addClass('disable');
	$('#btn_clear').addClass('disable');
	$('#btn_spin').attr('src','img/button_spin_disable.png');
	$('#btn_rebet').attr('src','img/button_rebet_disable.png');
	$('#btn_regame').attr('src','img/button_regame_disable.png');
	$('#btn_clear').attr('src','img/button_clearbet_disable.png');
	$('#select').show();
}

Game.prototype.hide_option = function()
{
	if(localStorage.getItem('effectSetting') == ''){
		if(GameMain.oSound != null) GameMain.oSound.destruct();
		GameMain.oSound = soundManager.createSound({
      		id: 'cSound',
      		url: 'audio/menu_on.mp3',
      		loops:1,
      		autoPlay:true,
      		volume: localStorage.getItem('effect_volume')
    	});
	}
	this.option_status = 0;
	$('#option_show').hide(500);
	$('#option').removeClass('active');
	
		$('#wheel').removeClass('disable');
	$('#wheel_show').is(':visible') ? $('#wheel').attr('src','img/wheel_hover.png') : $('#wheel').attr('src','img/wheel_normal.png');
		
	
	// else{ 
	// 	$('#wheel').addClass('disable');
	// 	$('#wheel').attr('src','img/wheel_disable.png');
	// }
	this.enableSpinButton();
	this.enableClearButton();
	this.enableRebetButton();
	$('#select').hide();
	
}

Game.prototype.enable_help = function()
{	
	if(localStorage.getItem('effectSetting') == ''){
		if(GameMain.oSound != null)
			GameMain.oSound.destruct();

		GameMain.oSound = soundManager.createSound({
      		id: 'cSound',
      		url: 'audio/menu_on.mp3',
      		loops:1,
      		autoPlay:true,
      		volume: localStorage.getItem('effect_volume')
    	});
	}
	if($('#help').hasClass('active')){
		$('#help').removeClass('active');
		$('#help_show').hide();
		$('#chip_area').show();
		$('#help').attr('src','img/help_normal.png')
	}
	else
	{
		$('#help_show #help_letter').hide();
		$('#help_show .change').html('');
		$('#help').addClass('active');
		$('#chip_area').hide();
		$('#help_show').show();
		$('#help').attr('src','img/help_hover.png')
	}
}

// start the game newly.
Game.prototype.newGame = function()
{
	this.changeSceneState(GameMain.SCENE_SPLASH);
}

// restart the game.
Game.prototype.replayGame = function()
{
}

// change the game state. betting, dealing, exit, etc.
Game.prototype.changeGameState = function(gameState)
{
	var self = this;
	switch (gameState)
	{
		case GameMain.GAME_BETTING:
			// fade in and out from dealing screen to betting screen.
			var fade_time = 1000;
			
			if(self.gameState!=GameMain.GAME_EXIT) {
				self.gameState = gameState;
				fade_time = 0;
			}
			$('#rot_back').fadeOut(1000);
			$('#game_area').fadeOut(fade_time);
			$('#result_area').fadeOut(1000);
			$('#winnumber_area').fadeOut(1000);
			$('#wheel').fadeIn(1000);
			$('#option').fadeIn(1000);
			$('#help').fadeIn(1000);
			$('#method_select').fadeIn(1000);
			$('#button_area').fadeIn(1000);
			$('#winnumber_sidebar').fadeOut(1000);
			$('#bet_back').fadeIn(fade_time,
				function() {
					self.gameState = gameState;
					$('#game_area').fadeIn(10);

					self.selBoardIndex = -1;
					self.selRoundIndex = -1;
					
					self.prevTime 		= 0;
					self.elapsedTime	= 0;
					

					$('#bet_back').show();
					$('#rot_back').hide();
					$('#button_area').show();
					$('#winnumber_sidebar').css('top','80px').css('left','170px');
					$('#winnumber_area').show();
					self.isShownLargeGold = true;
					if(localStorage.getItem('effectSetting') == '' && self.state){
						if(GameMain.oSound != null)
							GameMain.oSound.destruct();
						GameMain.oSound = soundManager.createSound({
				      		id: 'cSound',
				      		url: 'audio/menu_on.mp3',
				      		loops:1,
				      		autoPlay:true,
				      		volume: localStorage.getItem('effect_volume')
				    	});
				    	self.state = 0;
					}
					if(self.auto_setting == 1){
						infinite_play = setTimeout(function(){
							$('#win_popup').hide();
							$('#btn_regame').trigger('vclick');
						},1000);
					}	
				}
			);
			break;
		
		case GameMain.GAME_DEALING:
			// fade in and out from betting screen to dealing screen.
			self.gameState = gameState;
			
			$('#bet_back').fadeOut(1000);
			$('#wheel').fadeOut(1000);
			$('#option').fadeOut(1000);
			$('#help').fadeOut(1000);
			$('#winnumber_sidebar').css('top','228px').css('left','15px');
			$('#method_select').fadeOut(1000);
			$('#button_area').fadeOut(1000);
			$('#game_area').fadeOut(0);
			$('#wheel_show').hide();
			$('#option_show').hide();
			$('#winnumber_area').fadeOut(1000);
			$('#winnumber_sidebar').fadeIn(1000);
			$('#game_area').fadeIn(1000);
			$('#rot_back').fadeIn(1000,
				function() {
					$('#bet_back').hide();
					$('#rot_back').show();
					$('#button_area').hide();
					//$('#winnumber_area').hide();
					
					self.state          = 1;
					self.prevTime		= 0;
					self.elapsedTime	= 0;
					
					self.ballMoveRadius = Game.BALL_MOVERADIUS;
					self.ballMoveStatus = -1;
					self.ballMoveTime	= 0;
					
					self.smallGoldSound = 1;
					self.rotateAngle	= 0;
					self.ballAngle		= 0;
					self.rotateSpeed 	= Game.INIT_SPEED;
					self.ballSpeed		= Game.BALL_SPEED;
					self.decreaseTime	= self.ballRotateTime;// + Math.floor(Math.random() * 1000);
					
					//self.winningNumberIndex = parseInt(Math.random() * Game.PANEL_NUMBER_COUNT);
					self.ballMoveCategory   = parseInt(Math.random() * 3); 
					
					self.saveBettingData();
				}
			);
			break;
		
		case GameMain.GAME_EXIT:
			this.gameState 		= gameState;
			this.prevTime 		= 0;
			this.elapsedTime	= 0;
			break;
	}
}

// change the game scene state. splash, loading, game, etc.
Game.prototype.changeSceneState = function(sceneState)
{
	switch (sceneState)
	{
		case GameMain.SCENE_SPLASH:
			break;
			
		case GameMain.SCENE_LOADING:
			break;
			
		case GameMain.SCENE_GAME:
			this.changeGameState(GameMain.GAME_BETTING);
			break;
	}
	
	this.sceneState = sceneState;
}

// implement the all logic.
Game.prototype.doLogic = function()
{
	switch (this.sceneState)
	{
		case GameMain.SCENE_SPLASH:
			this.loadResources();
			this.changeSceneState(GameMain.SCENE_LOADING);
			break;
			
		case GameMain.SCENE_LOADING:
			if (JImage.loadedCount >= JImage.createCount)
			{
				this.changeSceneState(GameMain.SCENE_GAME);
			}
			break;
			
		case GameMain.SCENE_GAME:
			this.doGame();
			break;
			
		default:
			break;
	}
}

// implement the game logic.
Game.prototype.doGame = function()
{
	switch (this.gameState)
	{
		case GameMain.GAME_BETTING:
			// show the win popup.
			if (this.curWinMoney > 0)
			{
				if (this.prevTime == 0)
				{
					this.prevTime = System.currentTimeMillis();
					$('#win_popup #win_amount').html(this.formatNumber(this.curWinMoney));
					$('#win_popup').show();
					
					// setTimeout(function() {
					// 	$('#win_popup').hide();
					// }, 2000);
				}
			}
			break;
			
		case GameMain.GAME_DEALING:
		{
			// do the spin. from PaSong.
			this.wheel.doSpin();
		}
			break;
			
		case GameMain.GAME_EXIT:
		{
			// do the spin. from PaSong.
			this.wheel.doSpin();

			// update the result status.
			if (this.prevTime == 0)
			{
				this.prevTime = System.currentTimeMillis();
				
				this.calculateWinMoney();
				$('#result_number').html(this.winNumbers[this.winStatus.length - 1]);
				if (this.winStatus[this.winStatus.length - 1] == true)
					$('#result_status').html("WIN");
				else
					$('#result_status').html("NO WIN");
				
				var clr = this.getNumberColor(this.winNumbers[this.winStatus.length - 1]);
				
				$('#result_area').removeClass('red');
				$('#result_area').removeClass('green');
				$('#result_area').removeClass('black');
				
				switch (clr) {
					case 0:
						$('#result_area').addClass('red');
						break;
						
					case 1:
						$('#result_area').addClass('green');
						break;
						
					case 2:
						$('#result_area').addClass('black');
						break;
				}
				
				$('#result_area').show();
			}
				
			var eTime = System.currentTimeMillis() - this.prevTime;
			if (eTime > 0)
			{
				this.prevTime = System.currentTimeMillis();
				this.elapsedTime += eTime;
				
				if (this.elapsedTime >= Game.WINNING_SHOWTIME)
				{
					this.totalBettingMoney = 0;
					this.clearBettingData();
					this.changeGameState(GameMain.GAME_BETTING);
					this.enableSpinButton();
					this.enableClearButton();
					this.enableRebetButton();
					this.enableReturnButton();
				}
			}
		}
		break;
	}
}

// set the win number.
Game.prototype.setWinNumber = function(idx)
{
	this.winningNumberIndex = idx;
}

// calculate the win money of current game.
Game.prototype.calculateWinMoney = function()
{
	var i, j, k;
	console.log(Game.PANEL_NUMBERS);
	var winNumber = Game.PANEL_NUMBERS[this.winningNumberIndex];
	var winMoney  = 0, winIndex = 0;
	
	if (winNumber === 0)
		winIndex = Game.INDEX_0;
	else if (winNumber == '00')
		winIndex = Game.INDEX_00;
	else
		winIndex = winNumber - 1;
	
	// calculate for each cell.
	for (i = 0; i < this.bettingCounts[winIndex]; i++)
	{
		if (winNumber === 0 || winNumber == '00') 
			winMoney += Game.BettingAmounts[this.bettingInfos[winIndex][i]] * 1;
		else
			winMoney += Game.BettingAmounts[this.bettingInfos[winIndex][i]] * 36;
	}
	
	var factor = 1;
	
	// calculate for multi cell.
	if (this.gameMethod == 1) {
		for (i = Game.INDEX_2TO1; i < Game.BETBOARD_COUNT-1; i++)
		{
			
			if (i < Game.INDEX_SEQ12 + 3)
				factor = 3;
			else if (i < Game.INDEX_2NUMBERS)
				factor = 2;
			else if (i < Game.INDEX_4NUMBERS)
				factor = 18;
			else if (i < Game.INDEX_0)
				factor = 9;
			else
				factor = 1;
			
			for (j = 0; j < Game.SelBoardInfos[i - Game.INDEX_2TO1].length; j++)
			{
				if (winNumber == Game.SelBoardInfos[i - Game.INDEX_2TO1][j])
				{
					for (k = 0; k < this.bettingCounts[i]; k++)
					{
						winMoney += Game.BettingAmounts[this.bettingInfos[i][k]] * factor;
					}
					break;
				}
			}
		}
	}
	if (this.gameMethod == 2) {
		for (i = Game.INDEX_2TO1; i < Game.BETBOARD_COUNT; i++)
		{
			
			if (i < Game.INDEX_SEQ12 + 3)
				factor = 3;
			else if (i < Game.INDEX_2NUMBERS)
				factor = 2;
			else if (i < Game.INDEX_4NUMBERS)
				factor = 18;
			else if (i < Game.INDEX_0)
				factor = 9;
			else
				factor = 1;
			for (j = 0; j < Game.SelBoardInfos[i - Game.INDEX_2TO1].length; j++)
			{
				if (winNumber == Game.SelBoardInfos[i - Game.INDEX_2TO1][j])
				{
					for (k = 0; k < this.bettingCounts[i]; k++)
					{
						winMoney += Game.BettingAmounts[this.bettingInfos[i][k]] * factor;
					}
					break;
				}
			}
		}
	}
	if (this.gameMethod == 0) {
		for (i = Game.INDEX_2TO1; i < Game.BETBOARD_COUNT-2; i++)
		{
			if (i < Game.INDEX_SEQ12 + 3)
				factor = 3;
			else if (i < Game.INDEX_2NUMBERS)
				factor = 2;
			else if (i < Game.INDEX_4NUMBERS)
				factor = 18;
			else if (i < Game.INDEX_0)
				factor = 9;
			else
				factor = 1;
			for (j = 0; j < Game.SelBoardInfos[i - Game.INDEX_2TO1].length; j++)
			{
				if (winNumber == Game.SelBoardInfos[i - Game.INDEX_2TO1][j])
				{
					for (k = 0; k < this.bettingCounts[i]; k++)
					{
						winMoney += Game.BettingAmounts[this.bettingInfos[i][k]] * factor;
					}
					break;
				}
			}
		}
	}
	var count = this.winNumbers.length;
	
	this.winNumbers[count] = winNumber;
	if (winMoney == 0)
		this.winStatus[count] = false;
	else
		this.winStatus[count] = true;
		
	this.curWinMoney	= winMoney;
	this.totalWinMoney += winMoney;
	this.totalMoney = this.totalMoney + winMoney;
	
	this.updateWinNumber();
}

// Main draw function
Game.prototype.onDraw = function()
{
	switch (this.sceneState)
	{
		case GameMain.SCENE_SPLASH:
			break;
			
		case GameMain.SCENE_LOADING:
			break;
			
		case GameMain.SCENE_GAME:
			this.drawGame();
			break;
			
		default:
			break;
	}
}

// format the integer.
Game.prototype.formatNumber = function(val)
{
    var parts = val.toFixed(0).toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
	return Game.Currency + parts.join(".");
}

// draw the game.
Game.prototype.drawGame = function()
{
	var	i, j, x, y;
/*
	Graphics.MainGraphics.setFontSize(30);
	Graphics.MainGraphics.setColor(255, 0, 0);
	Graphics.MainGraphics.drawString("Body - " + $('body').width() + " : " + $('body').height(), 50, 0, 0);
	Graphics.MainGraphics.drawString("Window - " + $(window).width() + " : " + $(window).height(), 50, 50, 0);
	Graphics.MainGraphics.drawString("Resize - " + Roulette.resizeCallCount, 50, 100, 0);
*/
	if (this.gameState == GameMain.GAME_BETTING)
	{
		this.drawSelectedBoards();
	
		// draw the bet boards.
		for (i = 0; i < Game.BETBOARD_COUNT; i++)
			this.drawBettingChips(i);
		
		if (this.isShownLargeGold && (this.winNumbers.length > 0))
		{
			var idx = 0, winNumber = this.winNumbers[this.winNumbers.length - 1];
			if (this.gameMethod == 0)
			{
				
				if (winNumber === 0)
					idx = Game.INDEX_0;
				else if (winNumber == '00')
					idx = Game.INDEX_00;
				else
					idx = winNumber + Game.BETBOARD_INDEX - 1;
				
				var x = this.buttonDatas[4 * idx] + (this.buttonDatas[4 * idx + 2] - Game.CHIP_WIDTH) / 2;
				var y = this.buttonDatas[4 * idx + 1] + (this.buttonDatas[4 * idx + 3] - Game.CHIP_HEIGHT) / 2;
				if (idx == Game.INDEX_00)
				{
					var x = this.buttonDatas[4 * idx+2] + (this.buttonDatas[4 * idx + 4] - Game.CHIP_WIDTH) / 2 - 6;
					var y = this.buttonDatas[4 * idx + 3] + (this.buttonDatas[4 * idx + 5] - Game.CHIP_HEIGHT) / 2 -3;
				}
				if (idx == Game.INDEX_0)
				{
					var x = this.buttonDatas[4 * idx] + (this.buttonDatas[4 * idx + 2] - Game.CHIP_WIDTH) / 2 - 8;
					var y = this.buttonDatas[4 * idx + 1] + (this.buttonDatas[4 * idx + 3] - Game.CHIP_HEIGHT) / 2 -3;
				}			
				Graphics.MainGraphics.drawImage(this.imgLargeGold, x + 2, y - 2);
			}
			else if (this.gameMethod == 2)
			{
				idx = winNumber + Game.BETBOARD_INDEX - 1;
				var x = this.buttonDatas[4 * idx] + (this.buttonDatas[4 * idx + 2] - Game.CHIP_WIDTH) / 2;
				var y = this.buttonDatas[4 * idx + 1] + (this.buttonDatas[4 * idx + 3] - Game.CHIP_HEIGHT) / 2;
					
				Graphics.MainGraphics.drawImage(this.imgLargeGold, x + 2, y - 2);
			}
			if (this.gameMethod == 1)
			{
				if (winNumber == 0)
					idx = Game.INDEX_0;
				else
					idx = winNumber + Game.BETBOARD_INDEX - 1;
				
				var x = this.buttonDatas[4 * idx] + (this.buttonDatas[4 * idx + 2] - Game.CHIP_WIDTH) / 2;
				var y = this.buttonDatas[4 * idx + 1] + (this.buttonDatas[4 * idx + 3] - Game.CHIP_HEIGHT) / 2;
				
				if (idx == Game.INDEX_0){
					var x = this.buttonDatas[4 * idx] + (this.buttonDatas[4 * idx + 2] - Game.CHIP_WIDTH) / 2 - 8;
					var y = this.buttonDatas[4 * idx + 1] + (this.buttonDatas[4 * idx + 3] - Game.CHIP_HEIGHT) / 2;
				}	
				Graphics.MainGraphics.drawImage(this.imgLargeGold, x + 2, y - 2);
			}
		}
		
		/*
		for (i = Game.INDEX_2NUMBERS; i < Game.INDEX_0; i++) {
			Graphics.MainGraphics.setFillColor(255, 255, 255, 100);
			Graphics.MainGraphics.fillRect(this.buttonDatas[4 * i], this.buttonDatas[4 * i + 1], this.buttonDatas[4 * i + 2], this.buttonDatas[4 * i + 3]);
		}
		*/
		
		/*
		Graphics.MainGraphics.setFontSize(30);
		Graphics.MainGraphics.setColor(255, 0, 0);
		Graphics.MainGraphics.drawString('index: ' + Game.isClickedChipItem + ' pos: ' + Game.curChipMousePos[0], 50, 0, 0);
		*/
	}
	else
	{
		/*
		//for (i = Game.INDEX_2NUMBERS; i < Game.INDEX_0; i++) {
		for (i = 0; i < 48; i++) {
			Graphics.MainGraphics.setFillColor(255, 255, 255, 100);
			Graphics.MainGraphics.fillRect(this.betBoardDatas[4 * i], this.betBoardDatas[4 * i + 1], this.betBoardDatas[4 * i + 2], this.betBoardDatas[4 * i + 3]);
		}
		*/
		
		// draw the wheel.
		this.wheel.draw(Graphics.MainGraphics.context);
		
		var winNumber = Game.PANEL_NUMBERS[this.winningNumberIndex];
		
		// draw the bet board.
		if (this.ballMoveStatus == 3)
		{
			Graphics.MainGraphics.setFillColor(255, 255, 255, 150);
			
			if (winNumber == 0)
				this.drawBetBoard(Game.INDEX_0);
			if (winNumber == '00')
				this.drawBetBoard(Game.INDEX_00);
			else
				this.drawBetBoard(winNumber - 1);
				
			for (i = Game.INDEX_2TO1; i <= Game.INDEX_19TO36; i++)
			{
				for (j = 0; j < Game.SelBoardInfos[i - Game.INDEX_2TO1].length; j++)
				{
					if (winNumber == Game.SelBoardInfos[i - Game.INDEX_2TO1][j])
					{
						this.drawBetBoard(i);
						break;
					}
				}
			}
		}
		
		// draw the betting board.
		for (i = 0; i < Game.BETBOARD_COUNT; i++)
		{
			if (this.bettingCounts[i] > 0)
			{
				x = this.betBoardDatas[4 * i] + (this.betBoardDatas[4 * i + 2] - Game.BOARD_CHIP_WIDTH) / 2;
				y = this.betBoardDatas[4 * i + 1] + (this.betBoardDatas[4 * i + 3] - Game.BOARD_CHIP_HEIGHT) / 2 - 2;

				Graphics.MainGraphics.drawImageStretch(this.imgBoardChips[3], x, y, Game.BOARD_CHIP_WIDTH, Game.BOARD_CHIP_HEIGHT);
			}
		}
		
		// draw the small gold after finished the dealing.
		if (this.gameState == GameMain.GAME_EXIT)
		{
			if (winNumber === 0)
				i = Game.INDEX_0;
			else if (winNumber == '00')
				i = Game.INDEX_00;
			else
				i = winNumber - 1;
			
			x = this.betBoardDatas[4 * i] + (this.betBoardDatas[4 * i + 2] - this.imgSmallGold.width) / 2 + 1;
			y = this.betBoardDatas[4 * i + 1] + (this.betBoardDatas[4 * i + 3] - this.imgSmallGold.height) / 2 + 2;
			if (this.smallGoldSound == 1) {
				if(localStorage.getItem('effectSetting') == ''){
					if(GameMain.oSound != null) GameMain.oSound.destruct();
					GameMain.oSound = soundManager.createSound({
			      		id: 'wwSound',
			      		url: 'audio/menu_on.mp3',
			      		loops:1,
			      		autoPlay:true,
			      		volume: localStorage.getItem('effect_volume')
			    		});
				}	
				this.smallGoldSound = 0;
			}	
			Graphics.MainGraphics.drawImageStretch(this.imgSmallGold, x-1, y-5, 27, 29);
		}

		// draw the history information.		
		var idx = 1, clr = 0;
		
		var oldFontFamily = Graphics.MainGraphics.getFont().getFamilyName();
		
		Graphics.MainGraphics.setFontSize(30);
		Graphics.MainGraphics.setFontFamily("BoldDot");
	
		//this.winNumbers = [11, 10, 4, 12, 4, 31, 0, 24, 4, 15, 16];
		// draw the win number list.
		for (i = this.winNumbers.length - 1; i >= this.winNumbers.length - 20; i--)
		{
			if (i < 0)
				break;
				
			clr = this.getNumberColor(this.winNumbers[i]);
			
			$('#winside_' + idx).removeClass('black');
			$('#winside_' + idx).removeClass('red');
			$('#winside_' + idx).removeClass('green');
			
			switch (clr) {
				case 0:
					$('#winside_' + idx).addClass('red');
					break;
					
				case 1:
					$('#winside_' + idx).addClass('green');
					break;
					
				case 2:
					$('#winside_' + idx).addClass('black');
					break;
			}
			
			$('#winside_' + idx + " span").html(this.winNumbers[i]);
			if(idx <= 10) 
			{
				$('#winside_' + idx).css('top',(idx-1) * 35.7+'px').css('left','3px');
			}
			else 
			{
				$('#winside_' + idx).css('top',(idx-11) * 35.7+'px').css('left','63px');
			}
				
			$('#winside_' + idx).show();
			idx++;

			// switch (clr)
			// {
			// 	case 0:
			// 		Graphics.MainGraphics.setColor(255, 0, 0);
			// 		break;
					
			// 	case 1:
			// 		Graphics.MainGraphics.setColor(0, 200, 0);
			// 		break;
					
			// 	case 2:
			// 		Graphics.MainGraphics.setColor(137, 137, 137);
			// 		break;
			// }
				
			// Graphics.MainGraphics.drawString(this.winNumbers[i], 41 + clr * 37, 222 + idx * 40, Graphics.HCENTER);
			// idx++;
		}
		for (i = idx; i <= 20; i++)
		{
			$('#winside_' + i).hide();
		}
		Graphics.MainGraphics.setFontFamily(oldFontFamily);
	}
	
	// draw the winning numbers.
	//this.winNumbers = [11, 10, 4, 12, 4, 31, 24, 4, 15, 16];
	//this.winStatus = [false, true, true, false, false, false, true, false, true, false];
	if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(navigator.userAgent)){
		if (this.gameState == GameMain.GAME_BETTING)
		{
			$('#winnumber_area').css('left', 11);
			$('#winnumber_area').css('top', 485);
			$('#winnumber_area').css('width', 136);
			$('#winnumber_area .winbutton').css('width', 34);
		}
		else
		{
			$('#winnumber_area').css('left', 716);
			$('#winnumber_area').css('top', 491);
			$('#winnumber_area').css('width', 220);
			$('.winbutton').css('width', 55);
		}
	}
	if (/Chrome\/(\S+)/.test(navigator.userAgent)){
		if (this.gameState == GameMain.GAME_BETTING)
		{
			$('#winnumber_area').css('left', 12);
			$('#winnumber_area').css('top', 485);
			$('#winnumber_area').css('width', 136);
			$('#winnumber_area .winbutton').css('width', 34);
		}
		else
		{
			$('#winnumber_area').css('left', 717);
			$('#winnumber_area').css('top', 491);
			$('#winnumber_area').css('width', 220);
			$('.winbutton').css('width', 55);
		}
	}
	// draw the balance.
	if (this.gameState == GameMain.GAME_BETTING)
		x = 140;
	else
		x = 912;
		
	// draw the total money.
	Graphics.MainGraphics.setFontSize(16);
	Graphics.MainGraphics.setColor(131, 9, 9);
	if (this.gameState == GameMain.GAME_BETTING)
		Graphics.MainGraphics.drawString(this.formatNumber(this.totalMoney), x, 576, Graphics.RIGHT | Graphics.TOP);
	else 
		Graphics.MainGraphics.drawString(this.formatNumber(this.totalMoney), x, 546, Graphics.RIGHT | Graphics.TOP);
	// draw the total betting money.
	if (this.gameState == GameMain.GAME_BETTING)
		Graphics.MainGraphics.drawString(this.formatNumber(this.totalBettingMoney), x, 557, Graphics.RIGHT | Graphics.TOP);
	else 
		Graphics.MainGraphics.drawString(this.formatNumber(this.totalBettingMoney), x, 527, Graphics.RIGHT | Graphics.TOP);
	
	// draw the current win money.
	if (this.gameState == GameMain.GAME_BETTING)
		Graphics.MainGraphics.drawString(this.formatNumber(this.curWinMoney), x, 538, Graphics.RIGHT | Graphics.TOP);
	else
		Graphics.MainGraphics.drawString(this.formatNumber(this.curWinMoney), x, 508, Graphics.RIGHT | Graphics.TOP);

}

Game.prototype.updateWinNumber = function()
{
	var idx = 1;
	var clr = 0;
	
	for (i = this.winNumbers.length - 1; i >= this.winNumbers.length - 8; i--)
	{
		if (i < 0)
			break;
			
		clr = this.getNumberColor(this.winNumbers[i]);
			
		$('#winnumber_' + idx).removeClass('black');
		$('#winnumber_' + idx).removeClass('red');
		$('#winnumber_' + idx).removeClass('green');
		
		switch (clr) {
			case 0:
				$('#winnumber_' + idx).addClass('red');
				break;
				
			case 1:
				$('#winnumber_' + idx).addClass('green');
				break;
				
			case 2:
				$('#winnumber_' + idx).addClass('black');
				break;
		}
		
		$('#winnumber_' + idx + " span").html(this.winNumbers[i]);
		$('#winnumber_' + idx).show();
		
		idx++;
	}
	
	for (i = idx; i <= 8; i++)
	{
		$('#winnumber_' + i).hide();
	}
}

// get the color of current number. (red, black, green)
Game.prototype.getNumberColor = function(num)
{
	var i = 0;
	
	for (i = 0; i < Game.SelBoardInfos[8].length; i++)
	{
		if (num == Game.SelBoardInfos[8][i])
			return 0;
	}
	
	for (i = 0; i < Game.SelBoardInfos[9].length; i++)
	{
		if (num == Game.SelBoardInfos[9][i])
			return 2;
	}
	
	return 1;
}

// draw the selected boards.
Game.prototype.drawSelectedBoards = function()
{
	if (this.selBoardIndex < 0)
		return;

	Graphics.MainGraphics.setFillColor(255, 255, 255, 150);
	
	if ((this.selBoardIndex >= 0 && this.selBoardIndex < 36) || (this.selBoardIndex == Game.INDEX_0) || (this.selBoardIndex == Game.INDEX_00))
	{
		this.drawBoard(this.selBoardIndex);
	}
	else if (this.selBoardIndex <= Game.INDEX_0)
	{
		var idx = this.selBoardIndex - Game.INDEX_2TO1;
		for (i = 0; i < Game.SelBoardInfos[idx].length; i++)
			this.drawBoard(Game.SelBoardInfos[idx][i] - 1);
	}
	else if (this.selBoardIndex < Game.INDEX_0 + 38)
	{
		var idx = this.getRouletteIndex(this.selBoardIndex - Game.INDEX_0 - 1);
		if (idx == -1)
			return;
	
		for (i = -2; i <= 2; i++)
		{
			this.drawBoard(Game.INDEX_0 + 1 + Game.roulette_numbers[(idx + i + Game.roulette_numbers.length) % Game.roulette_numbers.length]);
		}
	}
	else
	{
		this.drawBoard(this.selBoardIndex);
	}
}

// get the roulette index from number.
Game.prototype.getRouletteIndex = function(num)
{
	var i = 0;
	
	for (i = 0; i < Game.roulette_numbers.length; i++)
	{
		if (Game.roulette_numbers[i] == num)
			return i;
	}
	
	return -1;
}

// draw the game board.
Game.prototype.drawBoard = function(idx)
{
	if (this.gameMethod == 0)
	{
		if (idx < Game.INDEX_0)
		{
			Graphics.MainGraphics.fillRect(
							this.buttonDatas[4 * idx],
							this.buttonDatas[4 * idx + 1],
							this.buttonDatas[4 * idx + 2],
							this.buttonDatas[4 * idx + 3]
						);
		}
		else if (idx == Game.INDEX_0)
		{
			Graphics.MainGraphics.fillPath(
							[
								this.buttonDatas[4 * idx],
								this.buttonDatas[4 * idx + 1],
								this.buttonDatas[4 * idx] + this.buttonDatas[4 * idx + 2],
								this.buttonDatas[4 * idx + 1],
								this.buttonDatas[4 * idx] + this.buttonDatas[4 * idx + 2],
								this.buttonDatas[4 * idx + 1] + this.buttonDatas[4 * idx + 3],
								this.buttonDatas[4 * idx],
								this.buttonDatas[4 * idx + 1] + this.buttonDatas[4 * idx + 3],
								this.buttonDatas[4 * idx + 4],
								this.buttonDatas[4 * idx + 5],
							]
						);
		}
		else if (idx == Game.INDEX_00)
		{
			
			Graphics.MainGraphics.fillPath(
							[
								this.buttonDatas[4 * idx +2],
								this.buttonDatas[4 * idx + 3],
								this.buttonDatas[4 * idx+2] + this.buttonDatas[4 * idx + 4],
								this.buttonDatas[4 * idx + 3],
								this.buttonDatas[4 * idx+2] + this.buttonDatas[4 * idx + 4],
								this.buttonDatas[4 * idx + 3] + this.buttonDatas[4 * idx + 5],
								this.buttonDatas[4 * idx +2],
								this.buttonDatas[4 * idx + 3] + this.buttonDatas[4 * idx + 5],
								this.buttonDatas[4 * idx + 6],
								this.buttonDatas[4 * idx + 7],
							]
						);
		}
	}
	else
	{
		if (idx < Game.BETBOARD_COUNT - 1)
		{
			Graphics.MainGraphics.fillRect(
							this.buttonDatas[4 * idx],
							this.buttonDatas[4 * idx + 1],
							this.buttonDatas[4 * idx + 2],
							this.buttonDatas[4 * idx + 3]
						);
		}
		else if (idx <= Game.INDEX_0)
		{
			Graphics.MainGraphics.fillPath(
							[
								this.buttonDatas[4 * idx],
								this.buttonDatas[4 * idx + 1],
								this.buttonDatas[4 * idx] + this.buttonDatas[4 * idx + 2],
								this.buttonDatas[4 * idx + 1],
								this.buttonDatas[4 * idx] + this.buttonDatas[4 * idx + 2],
								this.buttonDatas[4 * idx + 1] + this.buttonDatas[4 * idx + 3],
								this.buttonDatas[4 * idx],
								this.buttonDatas[4 * idx + 1] + this.buttonDatas[4 * idx + 3],
								this.buttonDatas[4 * idx + 4],
								this.buttonDatas[4 * idx + 5],
							]
						);
		}
	}
}

// draw the bet board.
Game.prototype.drawBetBoard = function(idx)
{
	if (idx < Game.BETBOARD_COUNT - 1)
		Graphics.MainGraphics.fillRect(
						this.betBoardDatas[4 * idx],
						this.betBoardDatas[4 * idx + 1],
						this.betBoardDatas[4 * idx + 2],
						this.betBoardDatas[4 * idx + 3]
					);
	else
		Graphics.MainGraphics.fillPath(
						[
							this.betBoardDatas[4 * idx],
							this.betBoardDatas[4 * idx + 1],
							this.betBoardDatas[4 * idx],
							this.betBoardDatas[4 * idx + 1] + this.betBoardDatas[4 * idx + 3],
							this.betBoardDatas[4 * idx] + this.betBoardDatas[4 * idx + 2],
							this.betBoardDatas[4 * idx + 1] + this.betBoardDatas[4 * idx + 3],
							this.betBoardDatas[4 * idx] + this.betBoardDatas[4 * idx + 2],
							this.betBoardDatas[4 * idx + 1],
							this.betBoardDatas[4 * idx + 4],
							this.betBoardDatas[4 * idx + 5],
						]
					);
}

// draw the chips on the betting board.
Game.prototype.drawBettingChips = function(idx)
{
	var	i;
	var x, y;

	x = this.buttonDatas[4 * (Game.BETBOARD_INDEX + idx)] + (this.buttonDatas[4 * (Game.BETBOARD_INDEX + idx) + 2] - Game.CHIP_WIDTH) / 2 - 2;
	y = this.buttonDatas[4 * (Game.BETBOARD_INDEX + idx) + 1] + (this.buttonDatas[4 * (Game.BETBOARD_INDEX + idx) + 3] - Game.CHIP_HEIGHT) / 2 + 3;
	if (idx == Game.INDEX_00){
		x = this.buttonDatas[4 * (Game.BETBOARD_INDEX + idx)+2] + (this.buttonDatas[4 * (Game.BETBOARD_INDEX + idx) + 4] - Game.CHIP_WIDTH) / 2 - 6;
		y = this.buttonDatas[4 * (Game.BETBOARD_INDEX + idx) + 3] + (this.buttonDatas[4 * (Game.BETBOARD_INDEX + idx) + 5] - Game.CHIP_HEIGHT) / 2 + 3;

	}
	if (idx == Game.INDEX_0){
		x = this.buttonDatas[4 * (Game.BETBOARD_INDEX + idx)] + (this.buttonDatas[4 * (Game.BETBOARD_INDEX + idx) + 2] - Game.CHIP_WIDTH) / 2 - 8;
		y = this.buttonDatas[4 * (Game.BETBOARD_INDEX + idx) + 1] + (this.buttonDatas[4 * (Game.BETBOARD_INDEX + idx) + 3] - Game.CHIP_HEIGHT) / 2 + 5;

	}
	Graphics.MainGraphics.setFontSize(20);
	Graphics.MainGraphics.setFontFamily("Bebas");
		
	for (i = 0; i < this.bettingCounts[idx]; i++)
	{
		Graphics.MainGraphics.drawImageStretch(this.imgBoardChips[this.bettingInfos[idx][i]], x, y, Game.CHIP_WIDTH, Game.CHIP_HEIGHT);
		Graphics.MainGraphics.setColor(Game.chipDatas[this.bettingInfos[idx][i]][4]);
		// if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(navigator.userAgent))
		// {
		// 	Graphics.MainGraphics.drawString(Game.BettingAmounts[this.bettingInfos[idx][i]], x + Game.CHIP_WIDTH / 2 + 3, y + 15, Graphics.HCENTER);
		// }
		// if (/Chrome\/(\S+)/.test(navigator.userAgent))
		// {
		// 	Graphics.MainGraphics.drawString(Game.BettingAmounts[this.bettingInfos[idx][i]], x + Game.CHIP_WIDTH / 2 + 3, y + 10, Graphics.HCENTER);
		// }
		if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(navigator.userAgent))
		{
			Graphics.MainGraphics.drawString(this.totalBettingMoney, x + Game.CHIP_WIDTH / 2 + 3, y + 15, Graphics.HCENTER);
		}
		if (/Chrome\/(\S+)/.test(navigator.userAgent))
		{
			Graphics.MainGraphics.drawString(this.totalBettingMoney, x + Game.CHIP_WIDTH / 2 + 3, y + 17, Graphics.HCENTER);
		}
		y -= 3;
		
	}
	
	Graphics.MainGraphics.setFontFamily("Myraid Pro");
}

// clear the last game information.
Game.prototype.clearLastGame = function()
{
	this.curWinMoney = 0;
	this.isShownLargeGold = false;
}

// process the mouse or touch event.
Game.prototype.onTouchEvent = function(motionEvent)
{
	var action = motionEvent.getAction();
	var x = motionEvent.getX();
	var y = motionEvent.getY();
	var idx = -1;
	
	if ($('#win_popup').is(':visible')){
		if(action == 1) $('#win_popup').hide();
		return;
	}

	var chipArea = document.getElementById('chip_area');
	
	// process the sliding chip event.
	if (x >= chipArea.offsetLeft && x < chipArea.offsetLeft + chipArea.offsetWidth &&
		y >= chipArea.offsetTop && y < chipArea.offsetTop + chipArea.offsetHeight)
	{
		x -= chipArea.offsetLeft;
		y -= chipArea.offsetTop;
		
		Game.curChipMousePos = [x, y];
	
		switch (action)
		{
			case 0: // Mouse Down
				Game.onMouseDown();
				break;
	
			case 1: // Mouse Up
				Game.onMouseUp();
				break;
	
			case 2: // Mouse Move
				Game.onMouseMove();
				break;
				
			default:
				break;
		}
		
		return;	
	}
	
	// get the button index which will have the focus.
	idx = this.getFocusButtonIndex(x, y);
	if (idx >= 0)
		this.clearLastGame();	
	
	this.selBoardIndex = idx;
	
	switch (action)
	{
		case 0: // Mouse Down
			break;

		case 1: // Mouse Up
			this.touchButton(idx);
			break;

		case 2: // Mouse Move
			break;
			
		default:
			break;
	}
}

// get the button index which will have the focus.
Game.prototype.getFocusButtonIndex = function(x, y)
{	
	var	i;
	$('#help_show #help_letter').show();
	
	for (i = Game.INDEX_4NUMBERS; i < Game.BETBOARD_COUNT ; i++)
	{	
		if(i == Game.INDEX_00)
		{	
			if (x >= this.buttonDatas[4 * i+2] && x <= this.buttonDatas[4 * i+2] + this.buttonDatas[4 * i + 4] &&
				y >= this.buttonDatas[4 * i + 3] && y <= this.buttonDatas[4 * i + 3] + this.buttonDatas[4 * i + 5])
			{	
				$('#help_show .change').html('1');
				return i;
			}
		}
		if(i == Game.INDEX_0)
		{	
			if (x >= this.buttonDatas[4 * i] && x <= this.buttonDatas[4 * i] + this.buttonDatas[4 * i + 2] &&
			y >= this.buttonDatas[4 * i + 1] && y <= this.buttonDatas[4 * i + 1] + this.buttonDatas[4 * i + 3])
			{	
				$('#help_show .change').html('1');
				return i;
			}
		}
		if (x >= this.buttonDatas[4 * i] && x <= this.buttonDatas[4 * i] + this.buttonDatas[4 * i + 2] &&
			y >= this.buttonDatas[4 * i + 1] && y <= this.buttonDatas[4 * i + 1] + this.buttonDatas[4 * i + 3])
		{
			$('#help_show .change').html('9');
			return i;
		}
		
	}
	
	for (i = Game.INDEX_2NUMBERS; i < Game.INDEX_4NUMBERS; i++)
	{
		if (x >= this.buttonDatas[4 * i] && x <= this.buttonDatas[4 * i] + this.buttonDatas[4 * i + 2] &&
			y >= this.buttonDatas[4 * i + 1] && y <= this.buttonDatas[4 * i + 1] + this.buttonDatas[4 * i + 3])
		{
			$('#help_show .change').html('18');
			return i;
		}
	}
	
	for (i = 0; i < Game.INDEX_2NUMBERS; i++)
	{
		if(i < Game.INDEX_2TO1)
		{	
			if (x >= this.buttonDatas[4 * i] && x <= this.buttonDatas[4 * i] + this.buttonDatas[4 * i + 2] &&
			y >= this.buttonDatas[4 * i + 1] && y <= this.buttonDatas[4 * i + 1] + this.buttonDatas[4 * i + 3])
			{	
				$('#help_show .change').html('36');
				return i;
			}
		}
		if(i < Game.INDEX_1TO18)
		{	
			if (x >= this.buttonDatas[4 * i] && x <= this.buttonDatas[4 * i] + this.buttonDatas[4 * i + 2] &&
			y >= this.buttonDatas[4 * i + 1] && y <= this.buttonDatas[4 * i + 1] + this.buttonDatas[4 * i + 3])
			{	
				$('#help_show .change').html('3');
				return i;
			}
		}
		if (x >= this.buttonDatas[4 * i] && x <= this.buttonDatas[4 * i] + this.buttonDatas[4 * i + 2] &&
			y >= this.buttonDatas[4 * i + 1] && y <= this.buttonDatas[4 * i + 1] + this.buttonDatas[4 * i + 3])
		{	
			$('#help_show .change').html('2');
			return i;
		}

	}
	$('#help_show #help_letter').hide();
	$('#help_show .change').html('');
	return -1;
}

// process the mouse or touch up event.
Game.prototype.touchButton = function(idx)
{
	if (this.gameState != GameMain.GAME_BETTING)
		return;
		
	if (idx >= Game.BETBOARD_INDEX && idx < Game.BETBOARD_INDEX + Game.BETBOARD_COUNT)
	{
		this.addBettingAmount(idx - Game.BETBOARD_INDEX);
	}
	else if (idx > Game.INDEX_00)
		this.addBettingAmount(idx);
}

// select the betting amount.
Game.prototype.selectBettingAmount = function(idx)
{
	var amount = Game.BettingAmounts[idx];
	// check if the amount exceeds
	// if (this.totalBettingMoney + amount > this.totalMoney)
	// {
	// 	alert("Balance is too low.");
	// 	return;
	// }
	
	Game.curBettingAmountIndex = idx;
}

// do the betting by the selected chip.
Game.prototype.addBettingAmount = function(idx)
{
	if (Game.curBettingAmountIndex < 0 || Game.curBettingAmountIndex >= Game.BETCHIP_COUNT)
		return;

	var amount = Game.BettingAmounts[Game.curBettingAmountIndex];
	if (this.gameMethod > 0)
	{
		if (idx <= Game.INDEX_0)
		{
			if (this.totalBettingMoney+amount >= 81)
			{
				//alert("Chip count must be smaller than 10");
				return;
			}
			// former code
			// if (this.bettingCounts[idx] >= Game.MAX_BOARCHIP_COUNT)
			// {
			// 	alert("Chip count must be smaller than 10");
			// 	return;
			// }
		
			// check if the amount exceeds
			// if (this.totalBettingMoney + amount > this.totalMoney)
			// {
			// 	alert("Balance is too low.");
			// 	return;
			// }
			
			this.totalBettingMoney  += amount;
			this.totalMoney -= amount;
			this.bettingInfos[idx][this.bettingCounts[idx]++] = Game.curBettingAmountIndex;
			this.rearrangeBettingChips(idx);
		}
		else
		{
			if (idx <= Game.INDEX_0 + 37)
			{
				for (i = -2; i <= 2; i++)
				{
					var idx1 = Game.roulette_numbers[(idx + i + Game.roulette_numbers.length) % Game.roulette_numbers.length] - 1;
					if (idx1 < 0) idx1 = 130;
					if (this.bettingCounts[idx1] >= Game.MAX_BOARCHIP_COUNT)
					{
						alert("Chip count must be smaller than 10");
						return;
					}
				}
			
				// if (this.totalBettingMoney + amount * 5 > this.totalMoney)
				// {
				// 	alert("Balance is too low.");
				// 	return;
				// }
			
				var idx = this.getRouletteIndex(this.selBoardIndex - Game.INDEX_0 - 1);
				if (idx == -1)
					return;
			
				for (i = -2; i <= 2; i++)
				{
					var idx1 = Game.roulette_numbers[(idx + i + Game.roulette_numbers.length) % Game.roulette_numbers.length] - 1;
					if (idx1 < 0) idx1 = 130;
					this.totalBettingMoney  += amount;
					this.totalMoney -= amount;
					this.bettingInfos[idx1][this.bettingCounts[idx1]++] = Game.curBettingAmountIndex;	
					this.rearrangeBettingChips(idx1);
				}
			}
			else
			{
				var idx1 = idx - Game.INDEX_0 - 38;
				
				for (i = 0; i < Game.roundValues[idx1].length; i++)
				{
					if (this.bettingCounts[Game.roundValues[idx1][i]] >= Game.MAX_BOARCHIP_COUNT)
					{
						alert("Chip count must be smaller than " + Game.MAX_BOARCHIP_COUNT);
						return;
					}
				}
			
				// if (this.totalBettingMoney + amount * Game.roundValues[idx1].length > this.totalMoney)
				// {
				// 	alert("Balance is too low.");
				// 	return;
				// }
				
				for (i = 0; i < Game.roundValues[idx1].length; i++)
				{
					this.totalBettingMoney  += amount;
					this.totalMoney -= amount;
					this.bettingInfos[Game.roundValues[idx1][i]][this.bettingCounts[Game.roundValues[idx1][i]]++] = Game.curBettingAmountIndex;	
					this.rearrangeBettingChips(Game.roundValues[idx1][i]);
				}
			}
		}
	}

	if (this.gameMethod == 0)
	{
		if (idx <= Game.INDEX_00)
		{
			if (this.totalBettingMoney+amount >= 81)
			{
				alert("Chip count must be smaller than 10");
				return;
			}
			// former code
			// if (this.bettingCounts[idx] >= Game.MAX_BOARCHIP_COUNT)
			// {
			// 	alert("Chip count must be smaller than 10");
			// 	return;
			// }
		
			// check if the amount exceeds
			// if (this.totalBettingMoney + amount > this.totalMoney)
			// {
			// 	alert("Balance is too low.");
			// 	return;
			// }
			
			this.totalBettingMoney  += amount;
			this.totalMoney -= amount;
			this.bettingInfos[idx][this.bettingCounts[idx]++] = Game.curBettingAmountIndex;
			this.rearrangeBettingChips(idx);
		}
		else
		{
			if (idx <= Game.INDEX_00 + 37)
			{
				for (i = -2; i <= 2; i++)
				{
					var idx1 = Game.roulette_numbers[(idx + i + Game.roulette_numbers.length) % Game.roulette_numbers.length] - 1;
					if (idx1 < 0) idx1 = 130;
					if (this.bettingCounts[idx1] >= Game.MAX_BOARCHIP_COUNT)
					{
						alert("Chip count must be smaller than 10");
						return;
					}
				}
			
				// if (this.totalBettingMoney + amount * 5 > this.totalMoney)
				// {
				// 	alert("Balance is too low.");
				// 	return;
				// }
			
				var idx = this.getRouletteIndex(this.selBoardIndex - Game.INDEX_00 - 1);
				if (idx == -1)
					return;
			
				for (i = -2; i <= 2; i++)
				{
					var idx1 = Game.roulette_numbers[(idx + i + Game.roulette_numbers.length) % Game.roulette_numbers.length] - 1;
					if (idx1 < 0) idx1 = 130;
					this.totalBettingMoney  += amount;
					this.totalMoney -= amount;
					this.bettingInfos[idx1][this.bettingCounts[idx1]++] = Game.curBettingAmountIndex;	
					this.rearrangeBettingChips(idx1);
				}
			}
			else
			{
				var idx1 = idx - Game.INDEX_00 - 39;
				
				for (i = 0; i < Game.roundValues[idx1].length; i++)
				{
					if (this.bettingCounts[Game.roundValues[idx1][i]] >= Game.MAX_BOARCHIP_COUNT)
					{
						alert("Chip count must be smaller than " + Game.MAX_BOARCHIP_COUNT);
						return;
					}
				}
			
				// if (this.totalBettingMoney + amount * Game.roundValues[idx1].length > this.totalMoney)
				// {
				// 	alert("Balance is too low.");
				// 	return;
				// }
				
				for (i = 0; i < Game.roundValues[idx1].length; i++)
				{
					this.totalBettingMoney  += amount;
					this.totalMoney -= amount;
					this.bettingInfos[Game.roundValues[idx1][i]][this.bettingCounts[Game.roundValues[idx1][i]]++] = Game.curBettingAmountIndex;	
					this.rearrangeBettingChips(Game.roundValues[idx1][i]);
				}
			}
		}
	}
	
	this.enableSpinButton();
	this.enableClearButton();
	this.enableRebetButton();
}

// rearrange the betting chip information.
Game.prototype.rearrangeBettingChips = function(idx)
{
	var i, j, betInfos = this.bettingInfos[idx];
	var tamount = 0, count = 0;
	var multi = 10;
	
	for (i = 0; i < betInfos.length; i++)
		tamount += Game.BettingAmounts[betInfos[i]] * multi;
		
	this.bettingInfos[idx]  = [];
	this.bettingCounts[idx] = 0;
	
	for (i = Game.BettingAmounts.length - 1; i >= 0; i--)
	{
		count = parseInt(tamount / Game.BettingAmounts[i] / multi);
		
		for (j = 0; j < count; j++)
			this.bettingInfos[idx][this.bettingInfos[idx].length] = i;
		
		this.bettingCounts[idx] += count;
		tamount -= count *  Game.BettingAmounts[i] * multi;
	}
}

// clear all betting datas.(on betting board)
Game.prototype.clearBettingData = function()
{
	var	i, j;
	
	for (i = 0; i < Game.BETBOARD_COUNT; i++)
	{
		this.bettingCounts[i] = 0;
		this.bettingInfos[i]  = [];
	}
	
	this.selBoardIndex = -1;
	this.totalMoney += this.totalBettingMoney;
	this.totalBettingMoney = 0;
}

// save all betting datas.
Game.prototype.saveBettingData = function()
{
	var	i, j;
	
	for (i = 0; i < Game.BETBOARD_COUNT; i++)
	{
		this.oldBettingCounts[i] = this.bettingCounts[i];
			for (j = 0; j < this.bettingCounts[i]; j++)
			{
				this.oldBettingInfos[i][j] = this.bettingInfos[i][j];
			}
	}
}

// restore all betting datas.
Game.prototype.restoreBettingData = function()
{
	var	i, j;
	this.totalMoney += this.totalBettingMoney;
	this.totalBettingMoney = 0;
	for (i = 0; i < Game.BETBOARD_COUNT; i++)
	{
		this.bettingCounts[i] = this.oldBettingCounts[i];
		for (j = 0; j < this.bettingCounts[i]; j++)
		{
			this.bettingInfos[i][j] = this.oldBettingInfos[i][j];
			this.totalBettingMoney += Game.BettingAmounts[this.oldBettingInfos[i][j]];
			this.totalMoney -= Game.BettingAmounts[this.oldBettingInfos[i][j]];
		}
	}
}

//when choosing methods, clean all oldBettingDatas
Game.prototype.cleanBettingData = function()
{
	var	i, j;
	
	this.totalBettingMoney = 0;
	for (i = 0; i < Game.BETBOARD_COUNT; i++)
	{
		this.oldBettingCounts[i] = 0;
		for (j = 0; j < this.bettingCounts[i]; j++)
		{
			this.oldBettingInfos[i][j] = 0;
		
		}
	}
}

// public void cleanRes()
Game.prototype.cleanRes = function()
{
}

// public void saveGameData()
Game.prototype.saveGameData = function()
{
}
