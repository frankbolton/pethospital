 var gameScore = function() {
	var score = 1000;
	var scoreIncrease = 1;
	var healCost = 10;
	var viewCost = 5;
	var id = "Score";//typeof arguments[3] !== "undefined" ? arguments[3] : "canvas"+MYAPP.newStation();
	var topOffset = 30;//typeof arguments[4] === 'number' ? arguments[4] : 100;
	var leftOffset = 100;//typeof arguments[5] === 'number' ? arguments[5] : 100;
    var width = 900;
    var height = 50;
	var canvasHTML = "<div id=\"gameScores\" style=\"position: absolute; top: "+topOffset+"px; left: "+leftOffset+"px;\">"
	canvasHTML +="<canvas id=\""+id+"\"  width=\""+width+"\" height=\""+height+"\" style=\"border:1px solid #000000;\">Your browser does not support HTML 5 Canvas. </canvas></div>";
	//var canvasHTML = "<canvas id=\""+id+"\" width=\"600\" height=\"50\" style=\"border:1px solid #000000;\">Your browser does not support HTML 5 Canvas. </canvas>";
    document.writeln(canvasHTML);
	var theCanvas = document.getElementById(id);
	var context = theCanvas.getContext("2d"); 
	var timer = 0;
	var t_Max = 10; //300: allow five minutes of game play per cycle
	var t_remaining = t_Max;
    
    
    //This is only drawn at the start of the running the function
    function drawScoreScreen() {
			//background
 			context.fillStyle = "#ffffaa";
  			context.fillRect(0, 0, width, height);
  			//text
			context.fillStyle    = "#000000";
			context.font         = "30px _sans";
			context.textBaseline = "top";
			context.fillText  ("Score: "+score, 75, 10 );	
  			
			//time remaining text
			t_remaining = t_Max - timer;
			context.fillText ("Time Remaining: "+ t_remaining,600,10);
			
  			//box
			context.strokeStyle = "#000000"; 
            context.strokeRect(5,  5, width-10, height-10);
			//context.strokeRect(5,  5, width-10, width-10);
        }
    drawScoreScreen();
    
	return {
		getscore: function () {
			return score;
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
			context.fillText  ("Score: "+score, 75, 10 );	
  			
			
			//time remaining text
			t_remaining = t_Max - timer;
            console.log("foo "+t_remaining);
			if (t_remaining>0){
                context.fillText ("Time Remaining: "+ t_remaining,600,10);
            }
            else {
                //context.fillRect(0, 0, width, height);
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
			//context.strokeRect(5,  5, 590, 40);
            context.strokeRect(5,  5, width-10, height-10);
        },
        
        healthViewPenalize: function (cost) {
            console.log("health penalize, score %i, cost %i",score, cost);
			score = score - cost;
			this.drawScoreScreen();
		},
        tick: function () {
            timer +=1;
            this.drawScoreScreen();
        },
        inc: function() {
            if (t_remaining>0){
                score += scoreIncrease; 
                }
        }
		
	};
}();
