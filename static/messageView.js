var mV = document.getElementById("mV");
var alwayson = document.getElementsByClassName("alwayson");
var costgenerators = document.getElementsByClassName("cost");
var notify = document.getElementsByClassName("notify");
var buttons = document.getElementsByClassName("buttons");
var messagetext = document.getElementsByClassName("messagetext");


var sound = document.getElementById('beep');
    
/*
* This function is run when the body loads. 
* It performs the initial setup of hiding most of the messaging too interface.
*/    
function start(){

    var c = document.getElementById("c").getContext("2d");
    c.fillStyle = "rgba(255, 200, 200, 1)";
    c.fillRect(0, 0, c.canvas.width, c.canvas.height);
    mV = document.getElementById("mV");
    console.log("on start has run.");
    for(var i=0; i< costgenerators.length; i++){
        costgenerators[i].hidden=true;
    }
    for(var i=0; i<notify.length;i++){
        notify[i].hidden=true;
    }
    for(var i=0; i< buttons.length; i++){
        buttons[i].hidden=true;
    }
    for(var i=0; i<messagetext.length;i++){
        messagetext[i].hidden=true;
    }
}

/*
* This function is run when an incoming message is received and a notification is required. 
* It shows the relevant message text and the buttons.
* This function also produces the audible notification.
*/
function showChat(){
    mV.hidden=false;
}
function hideChat(){
    mV.hidden=true;
}

function notification(subheading, newMessage){
    audio.play();
    if (subheading){
        notify[0].innerHTML = subheading;
    }
    for(var i=0; i<notify.length;i++){
        notify[i].hidden=false;
    }
    for(var i=0; i< buttons.length; i++){
        buttons[i].hidden=false;
    }
    if (newMessage){
        messagetext[0].innerHTML = newMessage;
    }
    
    
}


function readButtonPressed(){
    console.log("read button pressed");
    for(var i=0; i< buttons.length; i++){
        buttons[i].hidden=false;
    }
    for(var i=0; i<messagetext.length;i++){
        messagetext[i].hidden=false;
    }
}
function delayButtonPressed(){
    console.log("delay button prssed");

    for(var i=0; i<notify.length;i++){
        notify[i].hidden=true;
    }
    for(var i=0; i< buttons.length; i++){
        buttons[i].hidden=true;
    }

}

function closeButtonPressed(){
    console.log("close button pressed");
    for(var i=0; i<notify.length;i++){
        notify[i].hidden=true;
    }
    for(var i=0; i<messagetext.length;i++){
        messagetext[i].hidden=true;
    }
    for(var i=0; i< buttons.length; i++){
        buttons[i].hidden=true;
    }
    

    
}