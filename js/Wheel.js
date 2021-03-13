Wheel = function(game)
{
	this.game = game;
	
	this.imgWheel0	= null;
	this.imgWheel1	= null;
	this.imgWheel2	= null;
	this.imgBall	= null;
	this.imgHighlight = null;
	

	this.angle = 0;
	this.angle_speed = 1.2;
	this.theSpeedFrame = 60;

	this.ball_frame = -1;
	this.cx = 0;
	this.cy = 0;
	this.ball_speed_r = 0;
	this.ball_speed_a = 0;

	this.panelDatas = [176, 48, 506, 506];
/*
	//this.roulette_numbers = [0,23,3,35,12,28,7,29,18,22,9,31,14,20,1,33,16,24,5,10,23,8,30,11,36,13,27,6,34,17,25,2,21,4,19,15,32];
	this.roulette_numbers = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
	*/
	this.ball_dR = 256;
	this.ball_dA = 0;
	this.ball_w2 = 0;

	this.ball;
	this.bx = 0;
	this.by = 0;
	this.bHighLight = false;
	this.bRunningSpin = false;
	this.bSelectingTarget = false;
	this.bEnteringPanel = false;
	this.bVibrationState = false;
	this.allowStep = false;
	this.ball_target_a = 0;
	this.ball_Final_target_a = 0;
	this.ball_Final_target_b = 0;
	this.stepValue = 0;
	this.counterEntering = 0;
	this.vibrationCounter = 0;
	this.finishingNumber=0;
	this.finishingNumber1 = 0;
	this.bCheckTarget = false;
	this.accelor_V_slop1 = 0;
	this.accelor_V_slop2 = 0;
	this.accelor_ball = 0;

	this.bounce_ball = - 1.0;

	this.col_cnt = 0;
	this.col_time = 0;
	this.col_num = -1;

	this.hx = 0;
	this.hy = 0;
	this.ha = 0;
	this.bFirst = true;

	this.Rand = 0;
	
	this.bound_area = {
		r1: 220,	// 255
		r2: 175,	// 200
		r3: 142,	// 174
		r4: 125	// 148
	};
	
	this.metal_vert_vals = {
			r1: 190, //232, 
			r2: 212, //246, 
			al: 3.2 
	};
	this.metal_horz_vals = {
			r1: 194, //216, 
			r2: 206, //228, 
			al: 4.0
	};
};

Wheel.prototype.DegToRad = function (d)
{
    return d * 0.0174532925199432957;
};

Wheel.prototype.init = function() {
	
	this.ball_w2 = 10;
	this.cx = 253;	//wheel_0.width / 2;
	this.cy = 253;	//wheel_0.height / 2;
	
	var rad = this.DegToRad(this.ball_dA);
	this.bx = this.cx + this.ball_dR*Math.sin(rad) - this.ball_w2;
	this.by = this.cy - this.ball_dR*Math.cos(rad) - this.ball_w2;
	
	this.ball_frame = 0;
	
    // Reading initial conditions(variables and constants)
	this.ball_frame = 0;
	this.ball_dR = 256;
	this.ball_speed_r = 0;
	this.ball_speed_a = (228 + Math.random()*83) / 40;

    console.log("Start Spin : ball_dA=" + this.ball_dA);
    //document.getElementById("sel_num").innerHTML = "--";
    this.bHighLight = false;
    this.bRunningSpin = true;
    this.bEnteringPanel = false;
    this.bCheckTarget = false;
    this.col_cnt = 0;
    this.col_time = 0;
    this.col_num = -1;
    this.counterEntering = 0;
    this.finishingNumber = 0;
    this.finishingNumber1 = 0;
    this.bFirst = false;
    this.bSelectingTarget = false;
    this.stepValue = 0.3;

    this.accelor_V_slop1 = 9.8 * 0.4;
    this.accelor_V_slop2 = 9.8 * 0.9;

    this.Rand = Math.random();	
	
};

Wheel.prototype.loadResources = function() {
	this.imgWheel0 = JImage.decodeResource("wheel-0");
	//wheel panel moving in the center
	if (this.game.gameMethod == 1)
		this.imgWheel1 = JImage.decodeResource("wheel-1_1");
		
	if (this.game.gameMethod == 0)
		this.imgWheel1 = JImage.decodeResource("wheel-1_0");
	if (this.game.gameMethod == 2)
		this.imgWheel1 = JImage.decodeResource("wheel-1_2");
		console.log(Game.PANEL_NUMBER_COUNT);
		console.log(Game.roulette_numbers);
	this.imgWheel2 = JImage.decodeResource("wheel-2");
	this.imgBall	= JImage.decodeResource("ball");
	this.imgHighlight	= JImage.decodeResource("highlight");
};



Wheel.prototype.draw = function(surfaceContext) {
	
	surfaceContext.save();
	
	surfaceContext.translate(this.panelDatas[0], this.panelDatas[1]);
	
	surfaceContext.drawImage(this.imgWheel0.image, 0, 0);
	surfaceContext.translate(this.cx, this.cy);
	
	// Perform the rotation by the angle specified in the global variable.
	surfaceContext.rotate(this.DegToRad(this.angle));

	// Translate back to the top left of our image.
	surfaceContext.translate(-this.cx, -this.cy);
	
	// Finally we draw the rotated image on the canvas.
	surfaceContext.drawImage(this.imgWheel1.image, 0, 0);
	
	var rad = this.DegToRad(this.ball_dA);
	this.bx = this.cx+this.ball_dR*Math.sin(rad);
	this.by = this.cy-this.ball_dR*Math.cos(rad);
	surfaceContext.drawImage(this.imgBall.image, this.bx-this.ball_w2, this.by-this.ball_w2);
	
	if(this.bHighLight) {
		surfaceContext.translate(this.hx, this.hy);
		surfaceContext.rotate(this.ha);
		surfaceContext.drawImage(this.imgHighlight.image, -26, -47);
    }
	
	surfaceContext.restore();
	//surfaceContext.save();

	surfaceContext.drawImage(this.imgWheel2.image, this.panelDatas[0], this.panelDatas[1]);

	//surfaceContext.restore();
};


Wheel.prototype.doSpin = function() {
	this.ball_frame ++;
	
	
	if(this.bSelectingTarget == false){
		this.CountingBallPosition();
    }else{
    	this.CountingBallFinalPosition();
    }
	
//	this.angle -= this.angle_speed;
};

//=====================================================================================================
//This function calculates the ball's position and difference velocities related on function doSpin().
//Exception with moments taking the target number , it should be used itself for ball position.
//=====================================================================================================
Wheel.prototype.CountingBallPosition = function() {
	// here , ball_dR == ball's radial position.
	// accelor_V_slop1 == acceleration speed when ball runs on slop1 - the area
	// of the static panel.
	// accelor_V_slop2 == acceleration speed when ball runs on slop2 - the area
	// of the rotate panel except the numbers.
	// theSpeedFrame == 1/60 sec..

	// Our init ball takes an effect gravity acceleration about 20~30 degrees
	// even though he has no any motion.
	// Thus, he goes forward center of roulette panel.
	if (this.ball_dR > this.bound_area.r2 && this.ball_dR <= this.bound_area.r1) {
		this.ball_speed_r += this.accelor_V_slop1 / this.theSpeedFrame;
	}// end if

	// Unfortunately, our lovely ball goes backward center of roulette panel
	// according the factor of gravity efficiency defined above.
	if (this.ball_dR < this.bound_area.r4) {
		this.ball_speed_r -= this.accelor_V_slop2 / this.theSpeedFrame + 0.1;
	}// end if

	// The ball generally takes an effect because he jumps into a rotational
	// planet - centrifugal force!
	if (Math.abs(this.ball_speed_a) > 0) {
		this.accelor_ball = (this.ball_speed_a / this.theSpeedFrame)
				* (this.ball_speed_a / this.theSpeedFrame) * Math.abs(this.ball_dR);
		this.ball_speed_r -= this.accelor_ball / 10;
	}// end if

	// The ball takes an effect because he jumps into a rotational planet -
	// centrifugal force! , hut under the condition.
	// As a matter of fact , this condition might not be useful. So you may
	// watch out this condition operator!
	if (Math.abs(this.ball_speed_a) > 0 && this.bEnteringPanel) {
		this.accelor_ball = (this.angle_speed / this.theSpeedFrame)
				* (this.angle_speed / this.theSpeedFrame) * Math.abs(this.ball_dR);
		this.ball_speed_r -= this.accelor_ball / 10;
	}// end if

	// You may or not change following , watching ball's movement...
	if (Math.abs(this.ball_speed_a) > 0) {
		if (this.ball_speed_a > 0)
			this.ball_speed_a -= 0.005 * this.ball_speed_a;
		if (this.ball_speed_a < 0)
			this.ball_speed_a += 0.005 * this.ball_speed_a;
	}// end if

	// The ball bounces following area because slop2 has his geometric
	// characteristic
	if (Math.floor(this.ball_dR) <= this.bound_area.r4+4 && Math.floor(this.ball_dR) >= this.bound_area.r4+2
			&& Math.abs(this.ball_speed_r) < 1.5) {
		this.ball_speed_r -= Math.abs(this.ball_speed_r) * 2;
	}// end if

	// The ball could not be over via the circle roulette area.
	if (this.ball_dR > this.bound_area.r1+1) {
		if (this.bEnteringPanel == true) {
			this.ball_speed_r += (Math.abs(this.ball_speed_r) * 1.1);
		} else {
			this.ball_dR = this.bound_area.r1-1;
			this.ball_speed_r = 0;
		}

	}// end if

	// Following three condition operators are relative on the collision with
	// ball and metal panels.

	if (this.ball_dR > this.metal_vert_vals.r1 && this.ball_dR < this.metal_vert_vals.r2) {

		var real_alpha = this.ball_dA + this.angle + 22.5;
		var num = Math.floor(real_alpha / 45);

		if (num != this.col_num) {

			if (Math.abs(real_alpha - num * 45) < this.metal_vert_vals.al) // vertical
			{
				console.log("## Hit Vertical");
				this.ball_speed_r -= Math.abs(this.ball_speed_a) * 0.4; // Math.abs(ball_speed_r)*0.8;//0.8
				if (this.ball_speed_a >= 0)
					this.ball_speed_a -= Math.abs(this.ball_speed_a) * 0.4;
				else
					this.ball_speed_a += Math.abs(this.ball_speed_a) * 0.4;
				this.col_time = this.ball_frame;
				this.col_num = num;
			}
			// }
		}
	}// end if

	if (this.ball_dR > this.metal_horz_vals.r1 && this.ball_dR < this.metal_horz_valsr2) {

		var real_alpha = this.ball_dA + this.angle + 22.5;
		var num = Math.floor(real_alpha / 45);

		if (num != this.col_num) {

			if (num % 2 == 0) {
				if (Math.abs(real_alpha - num * 45) < this.metal_horz_vals.al) // horizontal
				{
					console.log("## Hit Horizontal");

					this.ball_speed_r -= Math.abs(this.ball_speed_a) * 0.1;
					if (this.ball_speed_a > 0)
						this.ball_speed_a += Math.abs(this.ball_speed_a) * 0.1;
					else
						this.ball_speed_a += Math.abs(this.ball_speed_a) * 0.1;
					this.col_time = this.ball_frame;
					this.col_num = num;

				}
			} else {
				if (Math.abs(real_alpha - num * 45) < this.metal_vert_vals.al) // vertical
				{
					console.log("## Hit Vertical");
					this.ball_speed_r += Math.abs(this.ball_speed_a) * 0.4; // =0.8
					if (this.ball_speed_a >= 0)
						this.ball_speed_a -= Math.abs(this.ball_speed_a) * 0.8;
					else
						this.ball_speed_a -= Math.abs(this.ball_speed_a) * 0.5; // 0.1
					this.col_time = this.ball_frame;
					this.col_num = num;
				}
			}
		}
	}// end if

	if (this.ball_dR >= this.metal_horz_vals.r2 && this.ball_dR <= this.metal_vert_vals.r1) {

		var real_alpha = this.ball_dA + this.angle + 22.5;
		var num = Math.floor(real_alpha / 45);

		if (num != this.col_num) {

			if (num % 2 == 0) {
				if (Math.abs(real_alpha - num * 45) < this.metal_horz_vals.al) // horizontal
				{
					console.log("## Hit horizontal");
					this.ball_speed_r += 1.0;// Math.abs(ball_speed_r);//0.01;
					if (this.ball_speed_a >= 0)
						this.ball_speed_a -= Math.abs(this.ball_speed_a) * 0.1;
					else
						this.ball_speed_a += Math.abs(this.ball_speed_a) * 0.1;// 1;
					this.col_time = this.ball_frame;
					this.col_num = num;
				}
			} else {
				if (Math.abs(real_alpha - num * 45) < this.metal_vert_vals.al) // vertical
				{
					console.log("## Hit vertical");
					this.ball_speed_r += 1.5;// Math.abs(ball_speed_r);// 0.01;
					if (this.ball_speed_a >= 0)
						this.ball_speed_a -= Math.abs(this.ball_speed_a) * 0.9;
					else
						this.ball_speed_a += Math.abs(this.ball_speed_a) * 1.1;// 1.5;
					this.col_time = this.ball_frame;
					this.col_num = num;
				}
			}
		}

	}// end if

	// Following condition operator relates with stepping of ball , entering the
	// rotational panel.
	if (this.ball_dR < this.bound_area.r2 && this.ball_dR > this.bound_area.r3-3) {
		if (this.ball_speed_r < 0) {
			this.ball_speed_r += Math.abs(this.ball_speed_r) * 1.3;
			this.ball_dR = this.bound_area.r3-4;
			this.finishingNumber1++;
		}
		if (this.ball_speed_r > 0) {
			if (this.ball_dR > this.bound_area.r2-2) {
				this.ball_dr = this.bound_area.r2-2;
			}
			if (this.ball_dR < this.bound_area.r3+1) {
				this.ball_dR = this.bound_area.r3-4;
			}

		}
	}// end if

	this.angle -= this.angle_speed;
	if (this.bEnteringPanel == false)
		this.ball_dA += this.ball_speed_a + this.angle_speed;
	if (this.bEnteringPanel == true)
		this.ball_dA += this.ball_speed_a;
	this.ball_dR -= this.ball_speed_r;

	// If the ball is in this area, the Function ActionCheckDetection() runs
	// continuously.
	// And then , if he is selected like as number in there, the Function
	// CountingBallFinalPosition() runs finally.
	if (this.ball_dR > this.bound_area.r4+2 && this.ball_dR < this.bound_area.r2) {
		if (this.bRunningSpin == true && this.bSelectingTarget == false) {
			this.ActionCheckDetection();
		}
	}// end if

	if (this.ball_dA > 360) {
		this.ball_dA -= 360;
	}// end if
	if (this.angle < 0) {
		this.angle = 360;
	}//end if
};

//================================================================================================
//Following function should be used when the ball enters in the collision area where numbers are.
//================================================================================================
Wheel.prototype.ActionCheckDetection = function() {
	
	var total = Game.PANEL_NUMBER_COUNT + 0.0000000000000000000001;
    var num = Math.floor( this.ball_dA * total / 360.0 );

    if(this.Rand <=0.2)this.stepValue=1; else this.stepValue=0.3;

    this.bEnteringPanel = true;
    if(this.ball_dR < this.bound_area.r3-4){
    	this.counterEntering ++;
    }
    this.ball_target_a = num * 360.0 / total + 4.865;
    this.ball_Final_target_a = this.ball_target_a + 2;
    this.ball_Final_target_b = this.ball_target_a - 2;
    var ball_effect_targeta = this.ball_target_a + 4;
    var ball_effect_targetb = this.ball_target_a - 4;
    this.ha = this.DegToRad(this.ball_target_a);
    this.hx = this.cx+(this.bound_area.r3-2)*Math.sin(this.ha);
    this.hy = this.cy-(this.bound_area.r3-2)*Math.cos(this.ha);

//    Depending ball's angle speed when entering into rotational panel, ball have got his anxious effect.
//    Correctly speaking, you have just looked the ball suddenly change his movement direction in this game.
    if(this.counterEntering == 1 )
    {
        if(Math.abs(this.ball_speed_a) < 0.5){
        	this.ball_speed_a -=  this.angle_speed * 0.8;
        }
    }

//    allowStep is used under conditions, notice carefully..
    if(this.ball_speed_a >= 0){
    	this.allowStep = false;
    }else if(this.ball_speed_a < 0){
    	this.allowStep = true;
    }
// Following two condition operators check collisions between ball and numbers when ball moves clockwise.
//    here, ball_dA is a variable  equal to angle of ball position,
//          ball_Final_target_a is a variable according to ball_dA - an angle when ball steps between numbers.
//          ball_dR is a variable , current ball's radius position.
//          stepValue is a constant, whether or not ball could jump along the numbers.
//          allowStep is a flag variable, allowing the ball's jump state.
    if(this.ball_dA >= this.ball_Final_target_a && this.ball_dR <= this.bound_area.r3+2 ){

        if(this.ball_speed_a > this.stepValue - 0.05  && this.allowStep == false){
            // ball's jump effect.
            if(this.ball_dA >= ball_effect_targeta) {
            	this.ball_dA += 2;
            	this.ball_speed_a -= this.stepValue/10;
            	this.bVibrationState = true;
            }

        }else if(this.ball_speed_a < this.stepValue-0.05 && this.allowStep == false){
        	this.allowStep = true;
            // ball's bounce effect.
        	this.ball_speed_a *= this.bounce_ball*0.95;//-= (Math.abs(ball_speed_a)*1.95) ;
        	this.bCheckTarget = true;
        }
    }
    // Following two condition operators check collisions between ball and numbers when ball moves counterclockwise.
//    here, ball_dA is a variable  equal to angle of ball position,
//          ball_Final_target_a is a variable according to ball_dA - an angle when ball steps between numbers.
//          ball_dR is a variable , current ball's radius position.
//          stepValue is a constant, whether or not ball could jump along the numbers.
//          allowStep is a flag variable, allowing the ball's jump state.
    if(this.ball_dA <= this.ball_Final_target_b && this.ball_dR <= this.bound_area.r3+2 ){

        if(Math.abs(this.ball_speed_a)  > this.stepValue  && this.allowStep == true){

            if(this.ball_dA <= ball_effect_targetb){
            	this.ball_dA -= 2;
            	this.ball_speed_a += this.stepValue ;
            	this.bVibrationState = true;
            }
        }else if(Math.abs(this.ball_speed_a) < this.stepValue   && this.allowStep == true){
        	this.ball_speed_a *= this.bounce_ball*0.95;//+= (Math.abs(ball_speed_a)*1.95) ;
        	this.bCheckTarget = true;
        }
    }

// This effect is related ball's movement smoothly.
    if(Math.abs(this.ball_speed_a) > 0 && this.ball_dR < this.bound_area.r3+2){
        if(this.ball_speed_a > 0){
        	this.ball_speed_a -= 0.0005;
        }else {
        	this.ball_speed_a += 0.0005;
        }
    }

//   our lovely ball could be vibrated when ... understand?(bVibrationState)
    if(this.bVibrationState == true){
    	this.vibrationCounter += 1;
        var direct = 0;
        if(this.vibrationCounter % 2 == 1)direct = Math.random()%0.5 + 0.5;
        else direct = - Math.random()%0.5 - 0.5;

        this.ball_speed_r += direct/2;
//        ball_dR += direct*4;
        if(this.vibrationCounter > 3)this.bVibrationState = false;
    }// end if

//    ball slowly stop in the selected number.
    if(this.ball_dA != this.ball_target_a){
        if(this.ball_dA > this.ball_target_a) this.ball_speed_a -= 0.001; else this.ball_speed_a += 0.001;
    }
    // The Ball's movement state according following conditions calls final event - for selecting number...
    if( 	this.ball_dA > this.ball_target_a-1 && 
    		this.ball_dA < this.ball_target_a + 1 && 
    		Math.abs(this.ball_speed_a) < 0.1 && 
    		this.ball_dR > this.bound_area.r3-4 && 
    		this.bSelectingTarget == false) {
        this.proc_finalize();
    }

};

Wheel.prototype.proc_finalize = function() {
	
	console.log("# proc_finalize");
	var total = Game.PANEL_NUMBER_COUNT + 0.0000000000000000000001;
    if(this.ball_dA >= 0) var num = Math.floor( this.ball_dA * total / 360.0 );
    if(this.ball_dA <  0) var num = Math.floor((Math.abs(this.ball_dA) + (180 - Math.abs(this.ball_dA))*2) * total/360 );
    var hit_num = Game.roulette_numbers[Math.abs(num) % Game.PANEL_NUMBER_COUNT];

    this.bHighLight = true;
    this.bRunningSpin = false;
    this.bEnteringPanel = false;
    this.bSelectingTarget = true;
    this.ball_target_a = num * 360.0 / total + 4.865;

    this.ball_speed_r -= 0.4;
    this.ha = this.DegToRad(this.ball_target_a);
    this.hx = this.cx+(this.bound_area.r3-2)*Math.sin(this.ha);
    this.hy = this.cy-(this.bound_area.r3-2)*Math.cos(this.ha);

    console.log("num="+num+", dA="+this.ball_target_a);
    console.log("hit_num="+hit_num);
//    document.getElementById("sel_num").innerHTML = "Selected : " + hit_num;
	this.game.setWinNumber(num);
    this.game.changeGameState(GameMain.GAME_EXIT);
    
};

//=====================================================================================================
//This function calculates the ball's position and difference velocities related on function doSpin().
//At just moments taking the target number , it should be used itself for final ball position.
//=====================================================================================================

Wheel.prototype.CountingBallFinalPosition = function() {

//  here, this function is a complex one with the Function CountingBallPosition() and Function ActionCheckDetection(), but the final...
//  Anyone who have seen those function could understand easily...
//  Concretely, please watch out above two Functions. not difficult, it's a piece of cake...
	
	//console.log("## CountingBallFinalPosition");
	var total = Game.PANEL_NUMBER_COUNT + 0.0000000000000000000001;

  if(this.ball_dR >this.bound_area.r2 && this.ball_dR <=this.bound_area.r1)
  {
	  this.ball_speed_r += this.accelor_V_slop1 /this.theSpeedFrame;
  }// end if
  if(this.ball_dR < this.bound_area.r4 )
  {
	  this.ball_speed_r -= this.accelor_V_slop2 /this.theSpeedFrame + 0.1;
  }// end if

  if(Math.abs(this.ball_speed_a) > 0 )
  {
      if(this.ball_speed_a > 0) this.ball_speed_a -= 0.005*this.ball_speed_a;
      if(this.ball_speed_a < 0) this.ball_speed_a += 0.005*this.ball_speed_a;
  }// end if

  if(Math.floor(this.ball_dR) == this.bound_area.r4+2 )
  {
	  this.ball_speed_r *= this.bounce_ball;
  }// end if

  if(this.ball_dR >this.bound_area.r1+1)
  {
      if(this.bEnteringPanel == true){
    	  this.ball_speed_r += (Math.abs(this.ball_speed_r)*1.1);
      }else{
    	  this.ball_dR = this.bound_area.r1-1;
    	  this.ball_speed_r = 0;
      }
  }// end if

  if( this.ball_dR < this.bound_area.r2 && this.ball_dR > this.bound_area.r3-3)
  {
      if( this.ball_speed_r < 0 ){
    	  this.ball_speed_r *= 0.5;//+= Math.abs(ball_speed_r)*1.3;
    	  this.ball_dR = this.bound_area.r3-4;
    	  this.finishingNumber1++;
      }
      if( this.ball_speed_r > 0){
          if(this.ball_dR > this.bound_area.r2-2){
        	  this.ball_dr = this.bound_area.r2-2;
          }
          if(this.ball_dR < this.bound_area.r3+4){
        	  this.ball_dR = this.bound_area.r3-4;
          }
      }
  }// end if

  if(Math.abs(this.ball_speed_a) > 0 )
  {
	  this.accelor_ball = (this.ball_speed_a/this.theSpeedFrame) * (this.ball_speed_a /this.theSpeedFrame) * Math.abs(this.ball_dR);
	  this.ball_speed_r -= this.accelor_ball;
  }// end if

  if(this.ball_dR < this.bound_area.r2){
	  this.ball_speed_r -= 1;
  }// end if

  var num = Math.floor( this.ball_dA * total / 360.0 );

  this.ball_target_a = num * 360.0 /total + 4.865;
  this.ball_Final_target_a = this.ball_target_a + 2;
  this.ball_Final_target_b = this.ball_target_a - 2;
  this.ha = this.DegToRad(this.ball_target_a);
  this.hx = this.cx+(this.bound_area.r3-2)*Math.sin(this.ha);
  this.hy = this.cy-(this.bound_area.r3-2)*Math.cos(this.ha);

  if(this.ball_speed_a >= 0){
	  this.allowStep = false;
  }else if(this.ball_speed_a < 0){
	  this.allowStep = true;
  }

  if(this.ball_dA >= this.ball_Final_target_a && this.ball_dR <= this.bound_area.r3+2 ){

      if(this.ball_speed_a > this.stepValue+0.2  && this.allowStep == false){
    	  this.ball_speed_a -= this.stepValue;
      }else if(this.ball_speed_a < this.stepValue+0.2 && this.allowStep == false){
    	  this.allowStep = true;
    	  this.ball_speed_a *= this.bounce_ball/3;//-= (Math.abs(ball_speed_a)*1.95) ;
    	  this.bCheckTarget = true;
      }
  }// end if
  if(this.ball_dA <= this.ball_Final_target_b && this.ball_dR <= this.bound_area.r3+2 ){

      if(Math.abs(this.ball_speed_a)  > this.stepValue+0.2  && this.allowStep == true){
    	  this.ball_speed_a += this.stepValue ;
    	  this.finishingNumber1++;

      }else if(Math.abs(this.ball_speed_a) < this.stepValue +0.2  && this.allowStep == true){
    	  this.ball_speed_a *= this.bounce_ball/3;//+= (Math.abs(ball_speed_a)*1.95) ;
    	  this.finishingNumber++;
    	  this.bCheckTarget = true;
      }
  }//end if

  this.angle -= this.angle_speed;
  this.ball_dA += this.ball_speed_a ;
  this.ball_dR -= this.ball_speed_r;

  if(this.ball_dA>360) {
	  this.ball_dA -= 360;
  }//end if
  if(this.angle < 0) {
	  this.angle = 360;
  }// end if

};








