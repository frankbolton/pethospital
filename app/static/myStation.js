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
	var drawcounter = 0;
    var buttonCounter = 0;
    var canvasHTML = "<div style=\"position: absolute; top: "+topOffset+"px; left: "+leftOffset+"px;\">";
	canvasHTML +="<canvas id=\""+id+"\" width=\"300\" height=\"350\" style=\"border:1px solid #000000;\">Your browser does not support HTML 5 Canvas. </canvas></div>";
	document.writeln(canvasHTML);
	console.log("writing CanvasHTML to the page");
    var theCanvas = document.getElementById(id);
	var context = theCanvas.getContext("2d"); 
	var station_h_visible = false;
	var buttonSize = {x:60, y:40};
    var showButtonpos = { x:40, y:280};
    var hideButtonpos = { x:120, y:280};
    var healButtonpos = { x:200, y:280};
    var myGameScore = arguments[7];
    var that = this;
    //image
	var helloWorldImage = new Image();
	helloWorldImage.src = "static/bakeno.gif";
	
    function eventLog(stationNumber, stationEvent) {
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
    
    function draw_station(){
            //console.log("time up? "+ myGameScore.time_up());
            drawcounter +=1;
			console.log("Drawing Canvas");
 			//clear canvas
            context.clearRect(0, 0, 300, 350);
            //background
			context.fillStyle = "#ffffaa";
  			context.fillRect(0, 0, 350, 350);
			//text
			context.fillStyle    = "#000000";
			context.font         = "20px _sans";
			context.textBaseline = "top";
			context.fillText  (id, 95, 20 );	
			//Health text
			if (station_h_visible){
				context.fillStyle    = "#000000";
				context.font         = "20px _sans";
				context.textBaseline = "top";
				context.fillText ("Health level: " + parseInt(station_health), 80 ,250);
			}
			//helloWorldImage.onload = function () {
			context.drawImage(helloWorldImage, 0, 50);
			//}		
			//box
			context.strokeStyle = "#000000"; 
			context.strokeRect(5,  5, 290, 340);
    		if (!station_h_visible ){
                //showButton
                context.fillStyle = "#ffffee";
                context.fillRect(showButtonpos.x, showButtonpos.y, buttonSize.x, buttonSize.y);
                context.fillStyle    = "#000000";
                context.strokeRect(showButtonpos.x, showButtonpos.y, buttonSize.x, buttonSize.y);
                context.font         = "20px _sans";
                context.textBaseline = "middle";
                context.fillText  ("Show", showButtonpos.x+7, showButtonpos.y + buttonSize.y/2);	
            }
                if (station_h_visible){
                //hideButton
                context.fillStyle = "#ffffee";
                context.fillRect(hideButtonpos.x, hideButtonpos.y , buttonSize.x, buttonSize.y);
                context.fillStyle    = "#000000";
                context.strokeRect(hideButtonpos.x, hideButtonpos.y , buttonSize.x, buttonSize.y);
                context.font         = "20px _sans";
                context.textBaseline = "middle";
                context.fillText  ("Hide", hideButtonpos.x+10, hideButtonpos.y + buttonSize.y/2);	
                //healButton
                context.fillStyle = "#ffffee";
                context.fillRect(healButtonpos.x, healButtonpos.y , buttonSize.x, buttonSize.y);
                context.fillStyle    = "#000000";
                context.strokeRect(healButtonpos.x, healButtonpos.y , buttonSize.x, buttonSize.y);
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
            eventLog(id, "show");
            }
            
    function hide_health() {
            console.log("in hide_health");
			station_h_visible = false;
			draw_station();
            eventLog(id, "hide");
            
		}
        
    function heal_station() {
            console.log("in hide_health");
            station_health = 100;
            myGameScore.healStationPenalize(view_cost);
            draw_station();
            eventLog(id, "show");
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
			context.drawImage(helloWorldImage, 0, 55);
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
	};
};
