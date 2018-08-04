console.log("success importing the logEvents code");    

var logEvents = function() {
    var eventLog = new Array();
    var periodicLog = new Array();
    var participantID = "-1";
    var stationCount = "-1";


    return {

        setParticipantID: function(id) {
            participantID = id;
        },

        setStationCount: function(count){
            stationCount = count;
        },

        logText: function(i, stationID, score) {
            var currentData = {};
            currentData.participantID = participantID;
            currentData.stationCount = stationCount;
            currentData.eventDescription = i;
            if (typeof stationID !== "undefined"){
                currentData.stationID = stationID;
            }            
            if (typeof score !="undefined"){
                currentData.participantScore = score;
            }
//             = gameScore.getScore();
            currentData.eventTime = Date.now();
            eventLog.push(currentData);
            //add pulling in the health statuses for the stations....

        },
        logPeriodic: function(score,pet1,pet2,pet3,pet4,pet5,pet6){
            var currentData = {};
            currentData.stationCount = stationCount;
            currentData.participantID = participantID;
            currentData.score = score;
            //The "or -1" section forces the value to -1 if no argument is passed to the function
            currentData.pet1 = pet1 || -1;
            currentData.pet2 = pet2 || -1;
            currentData.pet3 = pet3 || -1;
            currentData.pet4 = pet4 || -1;
            currentData.pet5 = pet5 || -1;
            currentData.pet6 = pet6 || -1;
            currentData.eventTime = Date.now();
            periodicLog.push(currentData);
        },
        printPeriodicLog: function(){
            return JSON.stringify(periodicLog);
        },
        printLog: function() {
            //return "this is a test";
            //for (i=0; i<eventLog.length; i++) {
            //    console.log(eventLog[i]) ;
            return myStringOutput = JSON.stringify(eventLog);    
        },

        pushLog: function() {
            var myStringOutput = '{"data":'+JSON.stringify(eventLog)+"}"
            console.log(myStringOutput);
            var request = new XMLHttpRequest();
            request.open('POST', '/logging', true);
            request.setRequestHeader('Content-Type', 'application/json');
            request.send(myStringOutput);

            myStringOutput = '{"data":'+JSON.stringify(periodicLog) + '}';
            request.open('POST', '/logPeriodic', true);
            request.setRequestHeader('Content-Type', 'application/json');
            request.send(myStringOutput);

        },

       neurosteer_log: function(message){
            var request = new XMLHttpRequest();
            request.open('POST', '/ns_logger', true);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            var postVars = 'msg='+message+"&sec=secret";
            request.send(postVars);
            return false;
       },
        

    };
}();