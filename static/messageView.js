var mV = document.getElementById("mV");
//var alwayson = document.getElementsByClassName("alwayson");
var notify = document.getElementsByClassName("notify");
var readButton = document.getElementById("readButton");
var delayButton = document.getElementById("delayButton");
var closeButton = document.getElementById("closeButton");
var messagetext = document.getElementsByClassName("messagetext");
var shapeButtons = document.getElementById("shapeButtons");
var shapes = document.getElementsByClassName("shape");

var sound = document.getElementById('beep');
var shapeIndex = -1;  
/*
* This function is run when the body loads. 
* It performs the initial setup of hiding most of the messaging too interface.
*/    
function start(){

    //mV = document.getElementById("mV");
    console.log("on start has run.");
    

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
    logEvents.neurosteer_log("interruption start");
    mV.hidden=false;
}
function hideChat(){
    logEvents.neurosteer_log("interruption end");
    mV.hidden=true;
}

function notification(subheading, newMessage){
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
        messagetext[0].innerHTML = newMessage;
    }
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
    
}

function shapeButtonPressed(buttonID){
    console.log("the button pressed is:");
    console.log(buttonID);
    if(buttonID == shapes[shapeIndex].id){
        correctShapePressed();
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
}

function checkToSendMessage(){
    var time = Date.now();
    console.log(".");
}