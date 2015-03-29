 var gameScore = function() {
	var score = 0;
	var scoreIncrease = typeof arguments[0] === 'number' ? arguments[0] : 5;
	var healCost = typeof arguments[0] === 'number' ? arguments[1] : 3;
	var viewCost = typeof arguments[0] === 'number' ? arguments[2] : 1;
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
    
	var canvasHTML = "<div id=\"gameScores\" style=\"position: absolute; top: "+topOffset+"px; left: "+leftOffset+"px;\">"
	canvasHTML +="<canvas id=\""+id+"\"  width=\""+width+"\" height=\""+height+"\" style=\"border:1px solid #000000;\">Your browser does not support HTML 5 Canvas. </canvas></div>";
	document.writeln(canvasHTML);
	var theCanvas = document.getElementById(id);
	var context = theCanvas.getContext("2d"); 
    context.font = "Arial, Helvetica, sans-serif"
	var timer = 0;
	var t_Max = 30; //300: allow five minutes of game play per cycle
	var t_remaining = t_Max;
    var scoreVisible = false;
    
    //var myIcon = new Image();
    //myIcon.source = "1410452410_game-theme_hospital.png";
    
    function getMinSec(){
    	var minutes = "0" + Math.floor(t_remaining / 60);
		var seconds = "0" + (t_remaining - minutes * 60);
		return minutes.substr(-2) + ":" + seconds.substr(-2);

    	//return "this is a test";
    }
    
    function eventLog() {
        var LogObject = {};

        LogObject['score']=gameScore.getscore();
        LogObject['secondsLeft']=gameScore.secondsLeft();
        LogObject['stationNumber']="scoreStation";
        LogObject['stationEvent']="ProceedToTLX";
        for (x in station) {
           LogObject['station '+x+' health'] = station[x].get_health();
        }
        
        var myjson =JSON.stringify(LogObject, null, 2);
        console.log(myjson);
        $.ajax({type: "POST", url:'/eventLog', data:myjson, contentType:'application/json'});

    }    
    
    
    function onMouseClick(e)
    {       
        mouseX=e.clientX-theCanvas.offsetLeft;
        mouseY=e.clientY-theCanvas.offsetTop;
        console.log("gameScore mouse: "+mouseX+" , y: "+mouseY);
        var l = leftOffset+790;
        var t = topOffset+ 5;
        if ((mouseX > l)&&(mouseX < l+100)&&(mouseY > t)&&(mouseY < t+40)){ //over the button
            if (!(t_remaining>0)) { //button is visible. This is the redirect... 
            	eventLog();
                if (!learnMode){
                    window.location.href="/after_questions";
                }
                else{
                    window.location.href="/after_learn";
                }
            }
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
		getscore: function () {
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
			    context.fillText  ("Score: "+score, 75, 10 );	
  			}
			
			//time remaining text
			t_remaining = t_Max - timer;
            //console.log("foo "+t_remaining);
            
            if ((t_remaining>0)&&(!learnMode)) {
                if (t_remaining % 60 > 55) {
                	context.fillStyle    = textColor;
                	context.font         = "30px _sans";
                	context.textBaseline = "top";
                    context.fillText  ("Score: "+score, 75, 10 );	
                    context.fillText ("In Experiment Mode",300,10);
                    //context.fillText ("Time Remaining: "+ t_remaining,600,10);
                    context.fillText ("Time Remaining: "+ getMinSec(),600,10);
                	
                
                }
                else {
                    context.fillStyle    = textColor;
                	context.font         = "30px _sans";
                	context.textBaseline = "top";
                    context.fillText ("Keep all health measures above zero and hidden to increase your score",20,10);
                }
            }    
            if ((t_remaining>0)&&learnMode){
             	context.fillStyle    = textColor;
                context.font         = "30px _sans";
            	context.textBaseline = "top";
                context.fillText  ("Score: "+score, 75, 10 );	
                context.fillText ("In Training Mode",300,10);
                //context.fillText ("Time Remaining: "+ t_remaining,600,10);
                context.fillText ("Time Remaining: "+ getMinSec(),600,10);
            }
            
            if (t_remaining<0) {
                //context.fillRect(0, 0, width, height);
                context.fillStyle    = textColor;
                context.font         = "30px _sans";
                context.textBaseline = "top";
                context.fillText  ("Score: "+score, 75, 10 );	
                context.fillText ("Time is up. Press ", 570, 10);
                
                //showButton
                context.fillStyle = "#00ffee";
                context.fillRect(790, 5, 100, 40);
                context.fillStyle    = textColor;
                context.font         = "20px _sans";
                context.textBaseline = "middle";
                context.fillText  ("continue", 800, 30);	
            }
            
  			//box
			context.strokeStyle = lineColor; 
			context.strokeRect(5,  5, width-10, height-10);
        },
        
        healthViewPenalize: function (view_cost) {
            console.log("health view penalize, score %i, cost %i",score, view_cost);
			score = score - view_cost;
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
