var myStation = function () {
	//myStation becomes the closure function in which to place the station functionality.  
	//it gives me the ability to add more station objects easily.
	// arguments: [0] health level at the start, [1] station decrease rate (%/s),
	// arguments_cont: [2] noise added, [3], viewing_cost, [4] stationID, [5] topOffset, [6] leftOffset 
	
	//HTML constants
    var buttonTextSize = "20px _sans";
    var TitleTextSize = "30px _sans";
    var HealthTextSize = "30px _sans";
    var stationSize = {x:280, y:280};
    var buttonSize = {x:60, y:40};
    var TitlePosition = {x:85,y:20};
    var HealthPosition = {x:30, y:(stationSize.y - (buttonSize.y *2.5))};
  
    var showButtonpos = { x:40, y:(stationSize.y - (buttonSize.y *1.5))};
    var hideButtonpos = { x:120, y:(stationSize.y - (buttonSize.y *1.5))};
    var healButtonpos = { x:200, y:(stationSize.y - (buttonSize.y *1.5))};
    var timeRemaining = true;
    var stationDead = false;
	
    var bgColor_unSel = "#ffffff";
    var bgColor_sel = "#ddffff";
    var bgColor_dead = "#1a1a1a";
	
    var buttonColor = "#eeeeee";
    var lineColor = "#a0a0a0"
    var textColor = "#404040";
    
    //var bgColor_unSel = "#ffeeaa";
    //var bgColor_sel = "#ffffaa";
    //var buttonColor = "#ffffee";
    //var textColor = "#000000";
    //var lineColor = "#000000"
   
    //image
    var helloWorldImage = new Image();
	//helloWorldImage.src = "static/cuteLion.gif";
	helloWorldImage.src = "static/1410447967_rabbit_animal_pink_cute.png";
	//helloWorldImage.src = "static/10411212_10152266707486863_7444125901069778805_n.jpg";
	var imageLocation = {x:40, y:50};
	var imageSize = {x:helloWorldImage.width, y:helloWorldImage.height}; 
	//image size read doesn't work... perhaps need to wait for the image to load??
	imageSize.x = 128;
	imageSize.y = 128;
	
	imageLocation.x = stationSize.x / 2 - imageSize.x / 2;
	imageLocation.y = stationSize.y / 2 - imageSize.x + 25;
	console.log("imagewidth" + helloWorldImage.width);
	var station_health = typeof arguments[0] === 'number' ? arguments[0] : 100;
	var station_hDelta = typeof arguments[1] === 'number' ? arguments[1] : 1;
	var station_noise = typeof arguments[2] === 'number' ? arguments[2] :0;
	var view_cost = typeof arguments[3] === 'number' ? arguments[3] :0;
	var id = typeof arguments[4] !== "undefined" ? arguments[4] : "canvas"+MYAPP.newStation();
	var topOffset = typeof arguments[5] === 'number' ? arguments[5] : 100;
	var leftOffset = typeof arguments[6] === 'number' ? arguments[6] : 100;
	var drawcounter = 0;
    var buttonCounter = 0;
    var canvasHTML = "<div style=\"position: absolute; top: "+topOffset+"px; left: "+leftOffset+"px;\">";
	canvasHTML +="<canvas id=\""+id+"\" width=\""+stationSize.x+"\" height=\""+stationSize.y+"\" style=\"border:1px solid #000000;\">Your browser does not support HTML 5 Canvas. </canvas></div>";
	document.writeln(canvasHTML);
	console.log("writing CanvasHTML to the page");
    var theCanvas = document.getElementById(id);
	var context = theCanvas.getContext("2d"); 
	var station_h_visible = false;
	
    var myGameScore = arguments[7];
    var that = this;
    
    
    debug = 1;
	
    function eventLog(stationNumber, stationEvent) {
    	if (debug ==1){
        	var LogObject = {};
        	LogObject['score']=gameScore.getscore();
        	LogObject['secondsLeft']=gameScore.secondsLeft();
        	LogObject['stationNumber']=stationNumber;
        	LogObject['stationEvent']=stationEvent;
        	for (x in station) {
        	   LogObject['station '+x+' health'] = station[x].get_health();
        	}
        
        	var myjson =JSON.stringify(LogObject, null, 2);
        	console.log(myjson);
        	$.ajax({type: "POST", url:'/eventLog', data:myjson, contentType:'application/json'});
		}
    }    
    
    function draw_station(){
        //console.log("time up? "+ myGameScore.time_up());
        drawcounter +=1;
        //console.log("Drawing Canvas");
        //console.log(TitlePosition.y);
        //clear canvas
        context.clearRect(0, 0, 300, 350);
        
        if (!station_h_visible&&!stationDead ){
            //background
            context.fillStyle = bgColor_unSel;
            context.fillRect(0, 0, stationSize.x, stationSize.y);
            //text
            context.fillStyle    = textColor;
            context.font         = TitleTextSize;
            context.textBaseline = "top";
            context.fillText  (id, TitlePosition.x, TitlePosition.y );	
            context.drawImage(helloWorldImage, imageLocation.x, imageLocation.y);
            context.strokeStyle = lineColor; 
            context.strokeRect(5,  5, stationSize.x-10, stationSize.y-10);
            //showButton
            context.fillStyle = buttonColor;
            context.fillRect(showButtonpos.x, showButtonpos.y, buttonSize.x, buttonSize.y);
            context.fillStyle    = lineColor;
            context.strokeRect(showButtonpos.x, showButtonpos.y, buttonSize.x, buttonSize.y);
            context.fillStyle	 = textColor;
            context.font         = buttonTextSize;
            context.textBaseline = "middle";
            context.fillText  ("Show", showButtonpos.x+7, showButtonpos.y + buttonSize.y/2);	
        }
        else if (station_h_visible&&!stationDead){
            //background
            context.fillStyle = bgColor_sel;
            context.fillRect(0, 0, stationSize.x, stationSize.y);
            //text
            context.fillStyle    = textColor;
            context.font         = TitleTextSize;
            context.textBaseline = "top";
            context.fillText  (id, TitlePosition.x, TitlePosition.y );
            context.globalAlpha = 0.5;	
            context.drawImage(helloWorldImage, imageLocation.x, imageLocation.y);
            context.globalAlpha = 1;
            context.strokeStyle = lineColor; 
            context.strokeRect(5,  5, stationSize.x-10, stationSize.y-10);
            //lockingText
            //context.fillText  ("Visible Health Blocks Score", 40, 230 );	
            //hideButton
            context.fillStyle = buttonColor;
            context.fillRect(hideButtonpos.x, hideButtonpos.y , buttonSize.x, buttonSize.y);
            context.fillStyle    = lineColor;
            context.strokeRect(hideButtonpos.x, hideButtonpos.y , buttonSize.x, buttonSize.y);
            context.fillStyle = textColor;
            context.font         = buttonTextSize;
            context.textBaseline = "middle";
            context.fillText  ("Hide", hideButtonpos.x+10, hideButtonpos.y + buttonSize.y/2);	
            //healButton
            context.fillStyle = buttonColor;
            context.fillRect(healButtonpos.x, healButtonpos.y , buttonSize.x, buttonSize.y);
            context.fillStyle    = lineColor;
            context.strokeRect(healButtonpos.x, healButtonpos.y , buttonSize.x, buttonSize.y);
            context.fillStyle = textColor;
            context.font         = buttonTextSize;
            context.textBaseline = "middle";
            context.fillText  ("Heal", healButtonpos.x+10, healButtonpos.y + buttonSize.y/2);	
            //healthLevel
            context.fillStyle    = textColor;
            context.font         = HealthTextSize;
            context.textBaseline = "top";
            context.fillText ("Health level: " + parseInt(station_health) + "%", HealthPosition.x ,HealthPosition.y);
        }
		else if (stationDead==true)
		{
            context.fillStyle = bgColor_dead;
            context.fillRect(0, 0, stationSize.x, stationSize.y);
			console.log("I'm drawing that the station is dead")
			
		}
    }
    draw_station();
    function show_health () {
		if (timeRemaining){
			console.log("in show_health");
        	station_h_visible = true;
        	myGameScore.healthViewPenalize(view_cost);
        	draw_station();
        	eventLog(id, "show");
        	}
		}
            
    function hide_health() {
        if (timeRemaining) {
			console.log("in hide_health");
        	station_h_visible = false;
        	draw_station();
        	eventLog(id, "hide");
        }
    }
        
    function heal_station() {
        if (timeRemaining) {
			console.log("in hide_health");
        	station_health = 100;
        	myGameScore.healStationPenalize(view_cost);
        	draw_station();
        	eventLog(id, "heal");
    	}
	}
         
    function onMouseClick(e)  {
        mouseX=e.clientX-theCanvas.offsetLeft;
        mouseY=e.clientY-theCanvas.offsetTop;
        //text
        console.log("mouse: "+mouseX+", "+mouseY);
        //showButtonpos
        var l = showButtonpos.x+leftOffset;
        var t = showButtonpos.y+topOffset;
        if ((mouseX > l)&&(mouseX < l+buttonSize.x)&&(mouseY > t)&&(mouseY < t+buttonSize.y)&&(!station_h_visible)){
            console.log("Show");
            show_health();
        }
        //hideButtonpos
        l = hideButtonpos.x+leftOffset;
        t = hideButtonpos.y+topOffset;
        if ((mouseX > l)&&(mouseX < l+buttonSize.x)&&(mouseY > t)&&(mouseY < t+buttonSize.y)&&(station_h_visible)){
            console.log("Hide");
            hide_health();
        }
        //healButtonpos
        l = healButtonpos.x+leftOffset;
        t = healButtonpos.y+topOffset;
        if ((mouseX > l)&&(mouseX < l+buttonSize.x)&&(mouseY > t)&&(mouseY < t+buttonSize.y)&&(station_h_visible)){
            console.log("Heal");
            heal_station();
        }
    }
        
    theCanvas.addEventListener("click", onMouseClick, false);   
       
    return {
        draw_stations: function(){
            console.log("time up? "+ myGameScore.time_up());
            drawcounter +=1;
			console.log("Drawing Canvas");
 			//clear canvas
            context.clearRect(0, 0, 300, 500);
            //background
			context.fillStyle = "#000000";//"#ffffaa";
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
			//helloWorldImage.src = "cutelion.gif";
			helloWorldImage.onload = function () {
			context.drawImage(helloWorldImage, 40, 55);
			}		
			//box
			context.strokeStyle = "#000000"; 
			context.strokeRect(5,  5, 290, 390);
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
        decrement: function () {
			station_health -= station_hDelta ;
            if (station_health < 0){
				
                station_health = 0;
				stationDead = true;
            }
			
            draw_station();
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
        get_testing: function() {
            return "drawcounter :"+drawcounter+", buttonCounter"+buttonCounter;
        },
        get_vis: function (){
            return station_h_visible;
        },
		timeIsUp: function(){
			timeRemaining = false;
		},
		isHeDead: function(){
			return stationDead;
		},
	};
};
