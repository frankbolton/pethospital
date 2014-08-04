 var gameScore = function() {
	var score = 0;
	var scoreIncrease = 3;
	var healCost = 4;
	var viewCost = 1;
	var id = "Score";
	var topOffset = 50;
	var leftOffset = 40;
    var width = 900;
    var height = 50;
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
    
    
    
    function onMouseClick(e)
    {       
        mouseX=e.clientX-theCanvas.offsetLeft;
        mouseY=e.clientY-theCanvas.offsetTop;
        console.log("gameScore mouse: "+mouseX+" , y: "+mouseY);
        var l = leftOffset+790;
        var t = topOffset+ 5;
        if ((mouseX > l)&&(mouseX < l+100)&&(mouseY > t)&&(mouseY < t+40)){ //over the button
            if (!(t_remaining>0)) { //button is visible. This is the redirect... 
                window.location.href="/after_questions";
            }
        }
    }
    theCanvas.addEventListener("click", onMouseClick, false); 
    
    //This is only drawn at the start of the running the function
    function drawScoreScreen() {
			//background
 			context.fillStyle = "#ffffaa";
  			context.fillRect(0, 0, width, height);
  			//text
            
			//time remaining text
			t_remaining = t_Max - timer;
			//context.fillText ("Time Remaining: "+ t_remaining,600,10);
			
  			//box
			context.strokeStyle = "#000000"; 
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
		getscore: function () {
			return score;
		},
		timeLeft: function () {
            return t_remaining>0;
        },
        secondsLeft: function () {
            return t_remaining;
        },
        
        
        //this seems to be the one called mostly.
        drawScoreScreen: function () {
			//background
 			context.fillStyle = "#ffffaa";
  			context.fillRect(0, 0, width, height);
  			//text

			context.fillStyle    = "#000000";
			context.font         = "30px _sans";
			context.textBaseline = "top";
			
            if (scoreVisible){
                context.fillStyle    = "#000000";
                context.font         = "30px _sans";
                context.textBaseline = "top";
			    context.fillText  ("Score: "+score, 75, 10 );	
  			}
			
			//time remaining text
			t_remaining = t_Max - timer;
            console.log("foo "+t_remaining);
            if (t_remaining>0) {
                if (t_remaining % 60 > 55) {
                    context.fillText  ("Score: "+score, 75, 10 );	
                    context.fillText ("Time Remaining: "+ t_remaining,600,10);
                }
                else {
                    context.fillText ("Keep all health measures above zero and hidden to increase your score",20,10);
                }
            }    

            if (t_remaining<0) {
                //context.fillRect(0, 0, width, height);
                context.fillText  ("Score: "+score, 75, 10 );	
                context.fillText ("Time is up. Press ", 570, 10);
                
                //showButton
                context.fillStyle = "#00ffee";
                context.fillRect(790, 5, 100, 40);
                context.fillStyle    = "#000000";
                context.font         = "20px _sans";
                context.textBaseline = "middle";
                context.fillText  ("continue", 800, 30);	
            }
            
  			//box
			context.strokeStyle = "#000000"; 
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
