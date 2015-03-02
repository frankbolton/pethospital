//Functions that will be called to perform actions

uid = turkNickName.toString();
sid = socket.socket.sessionid;


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

//var notify = 123;

var notification = {missed:"You missed message", ring:"Incoming message", full: "This is the full text", preview:null, messageHeader:"Message: :)", messageButton:"Done", previewButton:"Show", duration:10000, ringDuration:4000,  created:(new Date()).getTime()};

function notify(n){
  console.log("in notify");
  notification.created = (new Date()).getTime();
  socket.emit('msg',{uid:uid, socketid:sid, device:2, notify:n});
  
}

socket.on('serverConnect',function(){
  console.log("serverConnect success");
  socket.emit('identify',{socketid:socket.socket.sessionid, uid:turkNickName.toString(), device:2});
});

socket.on('joinedroom', function(data){
  console.log("joinedroom: " +toString(data));
  socket.emit('msg', {uid:data.uid, text:'msg', device:1});
});

socket.on('msg', function(data){console.log(data);});


//socket.emit('msg',{socketid:socket.socket.sessionid, uid:turkNickName.toString(), device:2});
setHeader("<h2>Pethospital mobile device</h2>");