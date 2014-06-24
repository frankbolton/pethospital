var myStation = function () {
	//myStation becomes the closure function in which to place the station functionality.  
	//it gives me the ability to add more station objects easily.
	// arguments: [0] health level at the start, [1] station decrease rate (%/s),
	// arguments_cont: [2] noise added, [3], viewing_cost, [4] stationID, [5] topOffset, [6] leftOffset 
	var station_health = typeof arguments[0] === 'number' ? arguments[0] : 100;
	var station_hDelta = typeof arguments[1] === 'number' ? arguments[1] : 1;
	var station_noise = typeof arguments[2] === 'number' ? arguments[2] :0;
	var view_cost = typeof arguments[3] === 'number' ? arguments[3] :0;
	var id = typeof arguments[4] !== "undefined" ? arguments[4] : "canvas"+MYAPP.newStation();
	var topOffset = typeof arguments[5] === 'number' ? arguments[5] : 100;
	var leftOffset = typeof arguments[6] === 'number' ? arguments[6] : 100;
	//var topOffset = 0;//typeof arguments[5] === 'number' ? arguments[5] : 100;
	//var leftOffset = 0;//typeof arguments[6] === 'number' ? arguments[6] : 100;
	var drawcounter = 0;
    var buttonCounter = 0;
    var canvasHTML = "<div style=\"position: absolute; top: "+topOffset+"px; left: "+leftOffset+"px;\">";
	canvasHTML +="<canvas id=\""+id+"\" width=\"300\" height=\"400\" style=\"border:1px solid #000000;\">Your browser does not support HTML 5 Canvas. </canvas></div>";
	//canvasHTML ="<canvas id=\""+id+"\" width=\"300\" height=\"400\" style=\"border:1px solid #000000;\">Your browser does not support HTML 5 Canvas. </canvas>";
	document.writeln(canvasHTML);
	console.log("writing CanvasHTML to the page");
    var theCanvas = document.getElementById(id);
	var context = theCanvas.getContext("2d"); 
	var station_h_visible = false;
	var buttonSize = {x:60, y:40};
    var showButtonpos = { x:40, y:350};
    var hideButtonpos = { x:120, y:350};
    var healButtonpos = { x:200, y:350};
    var myGameScore = arguments[7];
    var that = this;
    
    function draw_station(){
            //console.log("time up? "+ myGameScore.time_up());
            drawcounter +=1;
			console.log("Drawing Canvas");
 			//clear canvas
            //canvasHTML.width = canvasHTML.width;
            context.clearRect(0, 0, 300, 500);
            //background
			context.fillStyle = "#ffffaa";
  			context.fillRect(0, 0, 300, 500);
			//text
			context.fillStyle    = "#000000";
			context.font         = "20px _sans";
			context.textBaseline = "top";
			context.fillText  (id, 95, 40 );	
			//Health text
			if (station_h_visible){
				context.fillStyle    = "#000000";
				context.font         = "20px _sans";
				context.textBaseline = "top";
				context.fillText ("Health level: " + parseInt(station_health), 60 ,300);
			}
			//image
			var helloWorldImage = new Image();
			helloWorldImage.src = "bakeno.gif";
			helloWorldImage.onload = function () {
			context.drawImage(helloWorldImage, 0, 80);
			}		
			//box
			context.strokeStyle = "#000000"; 
			context.strokeRect(5,  5, 290, 390);
            //var hideButton1 = new TextButton(0,0,"Hide",buttonSize.x,buttonSize.y+30,"#ffffee","#000000", "#ff0000", "#000000");
			if (!station_h_visible ){
                //showButton
                context.fillStyle = "#ffffee";
                context.fillRect(showButtonpos.x, showButtonpos.y, buttonSize.x, buttonSize.y);
                context.fillStyle    = "#000000";
                context.font         = "20px _sans";
                context.textBaseline = "middle";
                context.fillText  ("Show", showButtonpos.x+7, showButtonpos.y + buttonSize.y/2);	
            }
                if (station_h_visible){
                //hideButton
                context.fillStyle = "#ffffee";
                context.fillRect(hideButtonpos.x, hideButtonpos.y , buttonSize.x, buttonSize.y);
                context.fillStyle    = "#000000";
                context.font         = "20px _sans";
                context.textBaseline = "middle";
                context.fillText  ("Hide", hideButtonpos.x+10, hideButtonpos.y + buttonSize.y/2);	
                //healButton
                context.fillStyle = "#ffffee";
                context.fillRect(healButtonpos.x, healButtonpos.y , buttonSize.x, buttonSize.y);
                context.fillStyle    = "#000000";
                context.font         = "20px _sans";
                context.textBaseline = "middle";
                context.fillText  ("Heal", healButtonpos.x+10, healButtonpos.y + buttonSize.y/2);	
            }
           
        }
    draw_station();
    function show_health () {
            console.log("in show_health");
            station_h_visible = true;
            myGameScore.healthViewPenalize(view_cost);
			draw_station();
            }
            
    function hide_health() {
            console.log("in hide_health");
			station_h_visible = false;
			draw_station();
            
		}
         
    function onMouseClick(e)  {
            buttonCounter +=1;
            console.log('that: '+that);
            console.log('this: '+this)
            //console.log(this.stationID);
            //that.draw_station();
            //select case through states and then the locations of buttons in those states
            mouseX=e.clientX-theCanvas.offsetLeft;
            mouseY=e.clientY-theCanvas.offsetTop;
            //text
            console.log("mouse: "+mouseX+", "+mouseY);
            //this.show_health();
            //find out which of the three buttons were pressed
            //---Also need to test if they are visible...
            //showButtonpos
            var l = showButtonpos.x+leftOffset;
            var t = showButtonpos.y+topOffset;
            if ((mouseX > l)&&(mouseX < l+buttonSize.x)&&(mouseY > t)&&(mouseY < t+buttonSize.y)){
                console.log("Show");
                //station_h_visible = true;
                //this.draw_station();
                show_health();
            }
            //hideButtonpos
            l = hideButtonpos.x+leftOffset;
            t = hideButtonpos.y+topOffset;
            if ((mouseX > l)&&(mouseX < l+buttonSize.x)&&(mouseY > t)&&(mouseY < t+buttonSize.y)){
                console.log("Hide");
                station_h_visible = false;
                //this.draw_station();
                hide_health();
            }
            //healButtonpos
            l = healButtonpos.x+leftOffset;
            t = healButtonpos.y+topOffset;
            if ((mouseX > l)&&(mouseX < l+buttonSize.x)&&(mouseY > t)&&(mouseY < t+buttonSize.y)){
                console.log("Heal");
                heal_station();
            }
        
        }
        
    theCanvas.addEventListener("click", onMouseClick, false);   
       
    return {
        
		
        draw_stations: function(){
            //drawcounter +=1;
			//console.log("Drawing Canvas");
 			////clear canvas
            ////canvasHTML.width = canvasHTML.width;
            //context.clearRect(0, 0, 300, 500);
            ////background
			//context.fillStyle = "#ffffaa";
  			//context.fillRect(0, 0, 300, 500);
			////text
			//context.fillStyle    = "#000000";
			//context.font         = "20px _sans";
			//context.textBaseline = "top";
			//context.fillText  (id, 95, 40 );	
			////Health text
			//if (station_h_visible){
			//	context.fillStyle    = "#000000";
			//	context.font         = "20px _sans";
			//	context.textBaseline = "top";
			//	context.fillText ("Health level: " + parseInt(station_health), 60 ,300);
			//}
			////image
			//var helloWorldImage = new Image();
			//helloWorldImage.src = "bakeno.gif";
			//helloWorldImage.onload = function () {
			//context.drawImage(helloWorldImage, 0, 80);
			//}		
			////box
			//context.strokeStyle = "#000000"; 
			//context.strokeRect(5,  5, 290, 390);
            ////var hideButton1 = new TextButton(0,0,"Hide",buttonSize.x,buttonSize.y+30,"#ffffee","#000000", "#ff0000", "#000000");
			////showButton
			//context.fillStyle = "#ffffee";
			//context.fillRect(showButtonpos.x, showButtonpos.y, buttonSize.x, buttonSize.y);
			//context.fillStyle    = "#000000";
			//context.font         = "20px _sans";
			//context.textBaseline = "middle";
			//context.fillText  ("Show", showButtonpos.x+7, showButtonpos.y + buttonSize.y/2);	
			////hideButton
			//context.fillStyle = "#ffffee";
			//context.fillRect(hideButtonpos.x, hideButtonpos.y , buttonSize.x, buttonSize.y);
			//context.fillStyle    = "#000000";
			//context.font         = "20px _sans";
			//context.textBaseline = "middle";
			//context.fillText  ("Hide", hideButtonpos.x+10, hideButtonpos.y + buttonSize.y/2);	
            ////healButton
			//context.fillStyle = "#ffffee";
			//context.fillRect(healButtonpos.x, healButtonpos.y , buttonSize.x, buttonSize.y);
			//context.fillStyle    = "#000000";
			//context.font         = "20px _sans";
			//context.textBaseline = "middle";
			//context.fillText  ("Heal", healButtonpos.x+10, healButtonpos.y + buttonSize.y/2);	
        
            console.log("time up? "+ myGameScore.time_up());
            drawcounter +=1;
			console.log("Drawing Canvas");
 			//clear canvas
            //canvasHTML.width = canvasHTML.width;
            context.clearRect(0, 0, 300, 500);
            //background
			context.fillStyle = "#ffffaa";
  			context.fillRect(0, 0, 300, 500);
			//text
			context.fillStyle    = "#000000";
			context.font         = "20px _sans";
			context.textBaseline = "top";
			context.fillText  (id, 95, 40 );	
			//Health text
			if (station_h_visible){
				context.fillStyle    = "#000000";
				context.font         = "20px _sans";
				context.textBaseline = "top";
				context.fillText ("Health level: " + parseInt(station_health), 60 ,300);
			}
			//image
			var helloWorldImage = new Image();
			helloWorldImage.src = "bakeno.gif";
			helloWorldImage.onload = function () {
			context.drawImage(helloWorldImage, 0, 80);
			}		
			//box
			context.strokeStyle = "#000000"; 
			context.strokeRect(5,  5, 290, 390);
            //var hideButton1 = new TextButton(0,0,"Hide",buttonSize.x,buttonSize.y+30,"#ffffee","#000000", "#ff0000", "#000000");
			if (!station_h_visible ){
                //showButton
                context.fillStyle = "#ffffee";
                context.fillRect(showButtonpos.x, showButtonpos.y, buttonSize.x, buttonSize.y);
                context.fillStyle    = "#000000";
                context.font         = "20px _sans";
                context.textBaseline = "middle";
                context.fillText  ("Show", showButtonpos.x+7, showButtonpos.y + buttonSize.y/2);	
            }
                if (station_h_visible){
                //hideButton
                context.fillStyle = "#ffffee";
                context.fillRect(hideButtonpos.x, hideButtonpos.y , buttonSize.x, buttonSize.y);
                context.fillStyle    = "#000000";
                context.font         = "20px _sans";
                context.textBaseline = "middle";
                context.fillText  ("Hide", hideButtonpos.x+10, hideButtonpos.y + buttonSize.y/2);	
                //healButton
                context.fillStyle = "#ffffee";
                context.fillRect(healButtonpos.x, healButtonpos.y , buttonSize.x, buttonSize.y);
                context.fillStyle    = "#000000";
                context.font         = "20px _sans";
                context.textBaseline = "middle";
                context.fillText  ("Heal", healButtonpos.x+10, healButtonpos.y + buttonSize.y/2);	
            }
           
        },    
		
        //hideCanvas: function() {
        //    context.clearRect(0, 0, 300, 500);
        //    //background
		//	context.fillStyle = "#ffffaa";
  		//	context.fillRect(0, 0, 300, 500);
        //},
        
        decrement: function () {
			station_health -= station_hDelta ;
		},
		get_health: function () {
			return station_health;
		},
        OK: function () {
            return station_health > 0;
        },
		get_h_d: function () {
			
            return station_hDelta;
        },
		get_noise: function (){
			return station_noise;
		},
		//temporary testing function
		get_html: function (){
			return canvasHTML;
		},
        get_testing: function() {
            return "drawcounter :"+drawcounter+", buttonCounter"+buttonCounter;
        },
        get_vis: function (){
            return station_h_visible;
        },
        
		
	};
};
