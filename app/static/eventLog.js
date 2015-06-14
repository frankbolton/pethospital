/**
 * Created by frank on 6/14/15.
 */

function eventLog(stationNumber, stationEvent) {
    	if (debugState ==1){
        	var LogObject = {};
        	LogObject['score']=gameScore.getscore();
        	LogObject['secondsLeft']=gameScore.secondsLeft();
        	LogObject['stationNumber']=stationNumber;
        	LogObject['stationEvent']=stationEvent;
            LogObject['learnMode'] = gameScore.getLearnMode();
            LogObject['browserTime']=new Date().getTime();
        	for (x in station) {
        	   LogObject['station '+x+' health'] = station[x].get_health();
        	}

        	var myjson =JSON.stringify(LogObject, null, 2);
            console.log("This is my json string");
            console.log(myjson);
        	jQuery.ajax({type: "POST", url:'/eventLog/', data:myjson, contentType:'application/json'});
		}
    }
