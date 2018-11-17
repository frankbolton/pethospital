 var gameScore = function() {
	var score = 0;
	var scoreIncrease = 50;
	var healCost = 30;
	var viewCost = 10;
	var id = "Score";
	var topOffset = 5;
	var leftOffset = 40;
    var width = 900;
    var height = 50;
    var learnMode = false;
    
    var bgColor_unSel = "#ffffff";
    var bgColor_sel = "#ddffff";
    var buttonColor = "#eeeeee";
    var lineColor = "#a0a0a0"
    var textColor = "#404040";
    
    var gameScoreText = "200 24px sans-serif"
    var textTopOffset = 14;
    var mentalDemand = 0;

	var canvasHTML = "<div id=\"gameScores1\" style=\"position: absolute; top: "+topOffset+"px; left: "+leftOffset+"px;\">"
	canvasHTML +="<canvas id=\""+id+"\"  width=\""+width+"\" height=\""+height+"\" style=\"border:1px solid #000000;\">Your browser does not support HTML 5 Canvas. </canvas></div>";
	document.writeln(canvasHTML);
	var theCanvas = document.getElementById(id);
	var context = theCanvas.getContext("2d"); 
    context.font = "Arial, Helvetica, sans-serif"
	var timer = 0;
	var t_Max = 300; //300: allow five minutes of game play per cycle
	var t_remaining = t_Max;
    var scoreVisible = false;
     
     
    var scoreVisibilityNumerator = 5; //5 of every x seconds the score will be visible
    var scoreVisibilityDenominator = 20; //x out of every 20 seconds the score will be visible
    
    var show_eeg = false;
    
      
    function getMinSec(){
    	var minutes = "0" + Math.floor(t_remaining / 60);
		var seconds = "0" + (t_remaining - minutes * 60);
		return minutes.substr(-2) + ":" + seconds.substr(-2);
    }
     

    
     
    
    function onMouseClick(e)
    {       
        mouseX=e.clientX-theCanvas.offsetLeft;
        mouseY=e.clientY-theCanvas.offsetTop;
        console.log("gameScore mouse: "+mouseX+" , y: "+mouseY);
        
        var l = leftOffset+790;
        var t = topOffset+ 5;
        if (t_remaining<=0)
        {
            console.log("area pressed, time over");
        }
    }
    theCanvas.addEventListener("click", onMouseClick, false); 
    
    //This is only drawn at the start of the running the function
    function drawScoreScreen() {
          
			//background
 			context.fillStyle = bgColor_unSel;
  			context.fillRect(0, 0, width, height);
  			//text
            
			//time remaining text
			t_remaining = t_Max - timer;
			//context.fillText ("Time Remaining: "+ t_remaining,600,10);
			
  			//box
			context.strokeStyle = lineColor; 
            context.strokeRect(5,  5, width-10, height-10);
			//context.strokeRect(5,  5, width-10, width-10);
        }
    
    drawScoreScreen();
    
    
    
	return {
        setEEG: function(show_eeg_v){
            show_eeg = show_eeg_v;
        },
        setMentalDemand: function(C){
            if(show_eeg){
                mentalDemand = C;
            }

        },
        setDuration: function (intimer) {
        //var station_health = typeof arguments[0] === 'number' ? arguments[0] : 100;
	        t_Max =  typeof intimer === 'number' ? intimer : 30;
            //t_Max = intimer;
        },
        setLearnMode: function () {
        //var station_health = typeof arguments[0] === 'number' ? arguments[0] : 100;
	        //t_Max =  typeof intimer === 'number' ? intimer : 30;
            //t_Max = intimer;
            learnMode = true;
        },
        //var scoreIncrease = 5;
        //var healCost = 3;
        //var viewCost = 1;
       setScoreDeltas: function (i,j,k) {
           scoreIncrease = i;
           healCost = j;
           viewCost = k;
        },
    
        getScoreDeltas: function () {
            return [scoreIncrease, healCost, viewCost];
        },
        
        getLearnMode: function () {
            return learnMode;
        },
        
        getScore: function () {
			return score;
		},
        
        timeLeft: function () {
            return t_remaining>0;
        },
        
        secondsLeft: function () {
            return t_remaining;
        },
        
        minutessecondsLeft: function () {
        	return getMinSec(t_remaining);
        },
        killTime: function() {
            timer = t_Max-10;
            
        },
        
        //this seems to be the one called mostly.
        drawScoreScreen: function () {
			//background
 			context.fillStyle = bgColor_unSel;
  			context.fillRect(0, 0, width, height);
  			//text
        

            if (scoreVisible){
                context.fillStyle    = textColor;
                context.font         = "30px _sans";
                context.textBaseline = "top";
			    context.fillText  ("Score: "+score, 15, 10 );	
  			}
			
			//time remaining text
			t_remaining = t_Max - timer;
            //console.log("foo "+t_remaining);
            
            bar_width = 280;
            //console.log(record.features);
            bar_fill = 2.8*mentalDemand;
            context.fillStyle = buttonColor;
            context.fillRect(280,textTopOffset, bar_width, textTopOffset+10);
            context.fillStyle    = textColor;
            context.font         = gameScoreText;
            //context.fillText("EEG: "+mentalDemand, 200, textTopOffset);
            context.fillText("Your activity ", 150, textTopOffset);
            context.fillRect(280,textTopOffset, bar_fill, textTopOffset+10);
            
            if ((t_remaining>0)&&(!learnMode)) {
                if (t_remaining % scoreVisibilityDenominator > (scoreVisibilityDenominator-scoreVisibilityNumerator)) {
                	context.fillStyle    = textColor;
                	context.font         = gameScoreText;
                	context.textBaseline = "top";
                    context.fillText  ("Score: "+score, 20, textTopOffset );	
                    //context.fillText ("In Experiment Mode",300,textTopOffset);
                    //context.fillText ("Time Remaining: "+ t_remaining,600,10);
                    context.fillText ("Time Remaining: "+ getMinSec(),600,textTopOffset);
                	
                
                }
                else {
                    context.fillStyle    = textColor;
                	context.font         = gameScoreText;
                	context.textBaseline = "top";
                    //context.fillText ("Keep all health measures above zero and hidden to increase your score",20,textTopOffset);
                    //context.fillText ("Keep the health levels above zero and hidden.",20,textTopOffset);
                    context.fillText ("Time Remaining: "+ getMinSec(),600,textTopOffset);
                }
            }    
            if ((t_remaining>0)&&learnMode){
                if (t_remaining % scoreVisibilityDenominator > (scoreVisibilityDenominator-scoreVisibilityNumerator)) {
                    context.fillStyle    = textColor;
                    context.font         = gameScoreText;
                    context.textBaseline = "top";
                    context.fillText  ("Score: "+score, 20, textTopOffset );
                    //context.fillText ("In Training Mode",300,textTopOffset);
                    //context.fillText ("Time Remaining: "+ t_remaining,600,10);
                    context.fillText ("Time Remaining: "+ getMinSec(),600,textTopOffset);
                }
                else {
                    context.fillStyle    = textColor;
                    context.font         = gameScoreText;
                    context.textBaseline = "top";
                    //context.fillText ("Keep all health measures above zero and hidden to increase your score",20,textTopOffset);
                    //context.fillText ("Keep the health levels above zero and hidden.",20,textTopOffset);
                    context.fillText ("Time Remaining: "+ getMinSec(),600,textTopOffset);
                }
            }
            
            if (t_remaining<0) {
                //context.fillRect(0, 0, width, height);
                context.fillStyle    = textColor;
                context.font         = gameScoreText;
                context.textBaseline = "top";
                context.fillText  ("Score: "+score, 40, textTopOffset);
                context.fillText ("This section time is up", 570, textTopOffset);
                //document.getElementById("gameScores").hidden=true;
                //document.getElementById("endsession").hidden = false;
               
            }
            
  			//box
			context.strokeStyle = lineColor; 
			context.strokeRect(5,  5, width-10, height-10);
        },
        
        healthViewPenalize: function () {
            console.log("health view penalize, score %i, cost %i",score, viewCost);
			score = score - viewCost;
			this.drawScoreScreen();
		},
        healStationPenalize: function () {
            console.log("heal penalize, score %i, cost %i",score, healCost);
			score = score - healCost;
			this.drawScoreScreen();
        },
        
        tick: function () {
            timer +=1;
            seconds = timer % 60;
            scoreVisible = false;
            this.drawScoreScreen();
        },
        inc: function() {
            if (t_remaining>0){
                score += scoreIncrease; 
            }
        }, 	
	};
}();
