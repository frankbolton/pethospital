var myStation = function () {
	//myStation becomes the closure function in which to place the station functionality.  
	//it gives me the ability to add more station objects easily.
	// arguments: [0] health level at the start, [1] station decrease rate (%/s),
	// arguments_cont: [2] noise added, [3], viewing_cost, [3] stationID, [4] topOffset, [5] leftOffset , [6] gameScore
	
	//HTML constants
    var buttonTextSize = "200 18px sans-serif";
    var TitleTextSize = "200 22px sans-serif";
    var HealthTextSize = "200 22px sans-serif";
    var stationSize = {x:280, y:280};
    var buttonSize = {x:60, y:40};
    var TitlePosition = {x:100,y:10};
    var HealthPosition = {x:50, y:(stationSize.y - (buttonSize.y *2.5))};
  
    var showButtonpos = { x:40, y:(stationSize.y - (buttonSize.y *1.5))};
    var hideButtonpos = { x:120, y:(stationSize.y - (buttonSize.y *1.5))};
    var healButtonpos = { x:200, y:(stationSize.y - (buttonSize.y *1.5))};
    var timeRemaining = true;
    
    var bgColor_unSel = "#ffffff";
    var bgColor_sel = "#ddffff";
    var buttonColor = "#eeeeee";
    var lineColor = "#a0a0a0"
    var textColor = "#404040";
    var scale = {x:1, y:1};
    //var bgColor_unSel = "#ffeeaa";
    //var bgColor_sel = "#ffffaa";
    //var buttonColor = "#ffffee";
    //var textColor = "#000000";
    //var lineColor = "#000000"
   
    //image
   
    var lastTimeVisible = 0;
    var autoHideAfterHeal = true;
   
    var helloWorldImage = new Image();
	helloWorldImage.src = "static/1410447967_rabbit_animal_pink_cute.png";
	var imageLocation = {};//{x:40, y:60};
	var imageSize = {x:helloWorldImage.width, y:helloWorldImage.height}; 
	//image size read doesn't work... perhaps need to wait for the image to load??
	imageSize.x = 128;
	imageSize.y = 128;
	
	imageLocation.x = stationSize.x / 2 - imageSize.x / 2;
	imageLocation.y = stationSize.y / 2 - imageSize.y / 2 - 30;
	console.log("imagewidth" + helloWorldImage.width);
	var station_health = typeof arguments[0] === 'number' ? arguments[0] : 100;
	var station_hDelta = typeof arguments[1] === 'number' ? arguments[1] : 1;
	var station_noise = typeof arguments[2] === 'number' ? arguments[2] :0;
	//var view_cost = typeof arguments[3] === 'number' ? arguments[3] :0;
	//var id = typeof arguments[3] !== "undefined" ? arguments[3] : "canvas"+MYAPP.newStation();
    var id = arguments[3];
    var topOffset = typeof arguments[4] === 'number' ? arguments[4] : 100;
	var leftOffset = typeof arguments[5] === 'number' ? arguments[5] : 100;
	var drawcounter = 0;
    var buttonCounter = 0;
    var canvasHTML = "<div style=\"position: absolute; top: "+topOffset+"px; left: "+leftOffset+"px;\">";
	canvasHTML +="<canvas id=\""+id+"\" width=\""+stationSize.x+"\" height=\""+stationSize.y+"\" style=\"border:1px solid #000000;\">Your browser does not support HTML 5 Canvas. </canvas></div>";
	document.writeln(canvasHTML);
	console.log("writing CanvasHTML to the page");
    var theCanvas = document.getElementById(id);
	var context = theCanvas.getContext("2d"); 
  context.scale(scale.x,scale.y);
	var station_h_visible = false;
	
    var myGameScore = arguments[6];
    var that = this;
    
    
    debugState = 1;
	
    function rand(min, max, whole) {
        return void 0===whole||!1===whole?Math.random()*(max-min+1)+min:!isNaN(parseFloat(whole))&&0<=parseFloat(whole)&&20>=parseFloat(whole)?(Math.random()*(max-min+1)+min).toFixed(whole):Math.floor(Math.random()*(max-min+1))+min;
    }

    
    function draw_station(){
        //console.log("time up? "+ myGameScore.time_up());
        drawcounter +=1;
        //console.log("Drawing Canvas");
        //console.log(TitlePosition.y);
        //clear canvas
        context.clearRect(0, 0, 300, 350);
        
        if (!station_h_visible ){
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
        if (station_h_visible){
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
            context.fillText ("Health Level: " + parseInt(station_health) + "%", HealthPosition.x ,HealthPosition.y);
            
            lastTimeVisible = timeNow;
        }
    }
    helloWorldImage.onload = function() {
    	draw_station();
    }
    
    function show_health () {
		if (timeRemaining){
			console.log("in show_health");
        	station_h_visible = true;
        	myGameScore.healthViewPenalize();
        	draw_station();
        	//eventLog(id, "show");
       	}
		}
            
    function hide_health() {
        if (timeRemaining) {
			console.log("in hide_health");
        	station_h_visible = false;
        	draw_station();
        	//eventLog(id, "hide");
        }
    }
        
    function heal_station() {
        if (timeRemaining) {
			console.log("in hide_health");
        	station_health = 100;
        	myGameScore.healStationPenalize();
        	draw_station();
        	//eventLog(id, "heal");
            if (autoHideAfterHeal){
               hide_health();
            }
    	}
	}
    

         
    function onMouseClick(e)  {
        //eventLog();
        mouseX=(e.clientX-theCanvas.offsetLeft)/scale.x;
        mouseY=(e.clientY-theCanvas.offsetTop)/scale.y;
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
            //hide_health();
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
            var myRand = rand(-1-station_noise,station_noise+1,true)
            //console.log("health before: " + station_health+", health delta: "+station_hDelta+", rand: "+myRand)
			            

            // the rand function never returns min or max, so I've pushed them out one more so we get the true range.
            
            if (station_health > 0){
                station_health -= station_hDelta ;
                station_health += myRand;
            }
            
            if (station_health < 0){
                station_health = 0;
            }
                
            
            if (station_health > 100){
                station_health = 100;
            }
            draw_station();
		},
    
     killstation: function() {
      station_health = 0;
    
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
    lastVisibleTime: function () {
      return (timeNow-lastTimeVisible)/1000;
    },
	};
};

