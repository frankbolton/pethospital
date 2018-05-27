console.log("success importing the logEvents code");    

var logEvents = function() {
    var eventLog = new Array();
    var participantID = "-1";


    return {

        setParticipantID: function(id) {
            participantID = id;
        },



        logText: function(i, stationID, score) {
            var currentData = {};
            currentData.participantID = participantID;
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

        printLog: function() {
            //return "this is a test";
            //for (i=0; i<eventLog.length; i++) {
            //    console.log(eventLog[i]) ;
            return myStringOutput = JSON.stringify(eventLog);    
        },

        pushLog: function() {
            var myStringOutput = JSON.stringify(eventLog);
            console.log(myStringOutput);
            var request = new XMLHttpRequest();
            request.open('POST', '/logging', true);
            //request.setRequestHeader('Content-Type', 'application/json');
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
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