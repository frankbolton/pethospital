//Functions that will be called to perform actions

uid = turkNickName.toString();
sid = socket.socket.sessionid;
var phoneHeader = "<h3>PetMobile Msnger</h3>";
var debug = 0;
/*function eventLog(stationNumber, stationEvent) {
	if (debug ==1){
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
}*/


function setStatus(state){ 
  //state = "green";
  //state = "red";
  socket.emit('msg', {uid:uid, socketid:sid, device:2, setStatus:state});
  console.log('setStatus: ', state);

};


//working
function setHeader(header){
  socket.emit('msg',{uid:uid, socketid:sid, device:2, setHeader:header});
}


function notify(n){
  console.log("in notify");
  n.created = (new Date()).getTime();
  socket.emit('msg',{uid:uid, socketid:sid, device:2, notify:n});
  eventLog(-1,{function:'in notify', uid:uid, socketid:sid, device:2, notify:n});
}

socket.on('serverConnect',function(data){
  console.log("serverConnect success"+toString(data));
  socket.emit('identify',{socketid:socket.socket.sessionid, uid:turkNickName.toString(), device:2});
  eventLog(-2, {function:'serverConnect'});
});

socket.on('joinedroom', function(data){
  console.log("joinedroom:");
  console.log(data);
  socket.emit('msg', {uid:data.uid, text:'msg', device:2});
  eventLog('-2', {function:'joinedRoom'});
  setHeader(phoneHeader);
  
});

socket.on('msg', function(data){
  console.log("msg");
  console.log(data);
  eventLog('-2', {function:'message received', data:data});
  if (data.phone=="joined"){
    console.log('startgame?')
  //  loop();
    setHeader(phoneHeader);
  }
});



setHeader(phoneHeader);