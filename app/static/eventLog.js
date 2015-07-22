/**
 * Created by frank on 6/14/15.
 */

function eventLog(stationNumber, stationEvent) {
    	//if (debugState ==1){
        	var LogObject = {};
        	if (typeof gameScore != 'undefined') {
                LogObject['score']=gameScore.getscore();
                LogObject['secondsLeft']=gameScore.secondsLeft();
        	    LogObject['learnMode'] = gameScore.getLearnMode();
                for (x in station) {
        	      LogObject['station '+x+' health'] = station[x].get_health();
        	    }
            }
        	LogObject['stationNumber']=stationNumber;
        	LogObject['stationEvent']=stationEvent;
            LogObject['browserTime']=new Date().getTime();
        	var myjson =JSON.stringify(LogObject, null, 2);
            console.log("This is my json string");
            console.log(myjson);
        	jQuery.ajax({type: "POST", url:'/eventLog/', data:myjson, contentType:'application/json'});
		//}
    }
