var mV = document.getElementById("mV");
//var alwayson = document.getElementsByClassName("alwayson");
var notify = document.getElementsByClassName("notify");
var readButton = document.getElementById("readButton");
var delayButton = document.getElementById("delayButton");
var closeButton = document.getElementById("closeButton");
var messagetext = document.getElementsByClassName("messagetext");
var shapeButtons = document.getElementById("shapeButtons");
var shapes = document.getElementsByClassName("shape");''

var sound = document.getElementById('beep');
var shapeIndex = -1;  
var participantId = document.getElementById("participantID").innerHTML;
/*
* This function is run when the body loads. 
* It performs the initial setup of hiding most of the messaging too interface.
*/    
function start(){

    //mV = document.getElementById("mV");
    console.log("on start has run.");
    toLog = "messageView Script started";
    logEvents.logText(toLog);

    for(var i=0; i<notify.length;i++){
        notify[i].hidden=true;
    }
    for(var i=0; i<messagetext.length;i++){
        messagetext[i].hidden=true;
    }
    for(var i=0; i<shapes.length; i++){
        shapes[i].hidden = true;
    }
    shapeButtons.hidden=true;
    readButton.hidden=true;
    delayButton.hidden=true;
    closeButton.hidden=true;
    mV.hidden = true;
}

/*
* This function is run when an incoming message is received and a notification is required. 
* It shows the relevant message text and the buttons.
* This function also produces the audible notification.
*/
function showChat(){
    logEvents.neurosteer_log("interrutionstart "+participantId );
    mV.hidden=false;
}
function hideChat(){
    logEvents.neurosteer_log("interruptionend "+participantId );
    mV.hidden=true;
}

function notification(subheading, newMessage, displayScore){
    
    //start with hiding all the things in case the user didn't click close 
    shapeButtons.hidden=true;
    readButton.hidden=true;
    delayButton.hidden=true;
    closeButton.hidden=true;
    for(var i=0; i<notify.length;i++){
        notify[i].hidden=true;
    }
    for(var i=0; i<messagetext.length;i++){
        messagetext[i].hidden=true;
    }
    for(var i=0; i<shapes.length; i++){
        shapes[i].hidden = true;
    }
    showChat();
    audio.play();
    if (subheading){
        notify[0].innerHTML = subheading;
    }
    for(var i=0; i<notify.length;i++){
        notify[i].hidden=false;
    }
    readButton.hidden=false;
    delayButton.hidden=false;
    //closeButton.hidden=false
    
    if (newMessage){
        var text = newMessage;
        if(displayScore){
            text = text + gameScore.getScore();
        }
        messagetext[0].innerHTML = text;
        
    }
    //log the time that the notification is displayed
    toLog = "messageView Script started";
    logEvents.logText(toLog);

}

function readButtonPressed(){
    console.log("read button pressed");
    shapeIndex = Math.floor(Math.random()*3);
    console.log(shapeIndex);
    delayButton.hidden=true;
    closeButton.hidden=true;
    readButton.hidden=true;   
    shapeButtons.hidden=false;
    shapes[shapeIndex].hidden=false;

    //log the time that the read button is pressed
    toLog = "messageView read button pressed";
    logEvents.logText(toLog);

    
}

function shapeButtonPressed(buttonID){
    console.log("the button pressed is:");
    console.log(buttonID);
    if(buttonID == shapes[shapeIndex].id){
        correctShapePressed();
        //log the time that the correct shape button is pressed
        toLog = "messageView correct shape";
        logEvents.logText(toLog);
    }
    else{
        //log the time that the incorrect shape button is pressed
        toLog = "messageView incorrect shape";
        logEvents.logText(toLog);
    }
}


function correctShapePressed(){
    console.log("correct shape selected");
    shapeButtons.hidden=true;
    shapes[shapeIndex].hidden=true;
    closeButton.hidden=false;    
    for(var i=0; i<messagetext.length;i++){
        messagetext[i].hidden=false;
    }
    //log the time that the message is displayed
    toLog = "messageView message displayed";
    logEvents.logText(toLog);
}


function delayButtonPressed(){
    console.log("delay button prssed");
    for(var i=0; i<notify.length;i++){
        notify[i].hidden=true;
    }
    delayButton.hidden=true;
    closeButton.hidden=true;
    readButton.hidden=true;
    hideChat();
    //log the time that the delay button is pressed
    toLog = "messageView message delay pressed";
    logEvents.logText(toLog);
}

function closeButtonPressed(){
    console.log("close button pressed");
    for(var i=0; i<notify.length;i++){
        notify[i].hidden=true;
    }
    for(var i=0; i<messagetext.length;i++){
        messagetext[i].hidden=true;
    }
    delayButton.hidden=true;
    closeButton.hidden=true;
    readButton.hidden=true;
    hideChat();
    //log the time that the close button is pressed
    toLog = "messageView message closed pressed";
    logEvents.logText(toLog);
}

function checkToSendMessage(){
    var time = Date.now();
    console.log(".");
}