var socket;
var data2 = [];
var bt = document.getElementById("bluetooth").innerHTML;
var crd = document.getElementById("creds").innerHTML;
var record;
var wsString;
if ( !window.WebSocket ) {
    window.WebSocket = window.MozWebSocket;
}
if ( window.WebSocket ) {
    var reconnectInterval = 1000 * 60;
    var connect = function () {
        var count = 0;
        wsString = "wss://api.neurosteer.com/api/v1/features/";
        wsString += bt;
        wsString += "/real-time/?access_token=";
        wsString += crd;
        //socket = new WebSocket( "wss://api.neurosteer.com/api/v1/features/{{bluetooth}}/real-time/?access_token={{creds}}" );
        socket = new WebSocket(wsString);
        socket.onmessage = function ( event ) {
        record = JSON.parse( event.data ); // convert to JSON
        // put your business logic here
        //console.log(  record.features ); // print list of biomarkers
        //document.getElementById("c1").innerHTML = "c1: "+ Math.round((record.features.c1+1)*50)
        //document.getElementById("c2").innerHTML = "c2: "+ Math.round(record.features.c2*10)
        //document.getElementById("c3").innerHTML = "c3: "+ Math.round(record.features.c3*10)
        
        gameScore.setMentalDemand(Math.round((record.features.c1+1)*50));
    };
    socket.onopen = function ( event ) {
        var ta = document.getElementById( 'responseText' );
        console.log(   "Web Socket opened!" );
    };
    socket.onerror = function () {
        console.log( 'socket error' );
        setTimeout( connect, reconnectInterval );
    };
    socket.onclose = function ( event ) {
        console.log( 'socket close' );
        var ta = document.getElementById( 'responseText' );
        console.log(  "Web Socket closed, reconnect in " + reconnectInterval + " msec" );
        setTimeout( connect, reconnectInterval );
    };
};
connect();
} else {
	alert( "Your browser does not support Web Socket." );
}