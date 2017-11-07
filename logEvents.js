console.log("success importing the logEvents code");    

var logEvents = function() {
    //var baseData = {};
    //baseData.startTime = Date.now(); 
    var eventLog = new Array();

    var participantID = "-1";


    return {

        setParticipantID(id) {
            participantID = id;
        },


        logText: function(i, stationID) {
            //eventLog.push(i);
            currentData = {};
            currentData.participantID = participantID;
            currentData.eventDescription = i;
            if (typeof stationID !== "undefined"){
                currentData.stationID = stationID;
            }            
            currentData.participantScore = gameScore.getScore();
            currentData.eventTime = Date.now();
            eventLog.push(currentData);
            //add pulling in the health statuses for the stations....

        },

        printLog: function() {
            //return "this is a test";
            //for (i=0; i<eventLog.length; i++) {
            //    console.log(eventLog[i]) ;
            return myStringOutput = JSON.stringify(eventLog);    
        },



        

    };
}();