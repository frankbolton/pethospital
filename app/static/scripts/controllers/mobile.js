'use strict';
console.log('in mobile.js');
angular.module('ktz')
  .controller('MobileCtrl', function ($scope, $http, $routeParams, $route) {
	 console.log($routeParams);
	 //var a = $routeParams;
	 //$rootScope.$on('$routeChangeSuccess', function () {
	 console.log($routeParams.uid);
	 //console.log($routeParams.type);
	 //console.log(a[2]);
	  //});
	  $scope.turkuid = $routeParams.uid
	  //$scope.turkuid = 12345;

      $scope.landmarks = {state:'idle'};

      $scope.setlandmark = function(k,v){
	  $scope.landmarks[k] = v;
      };

      var socket = io.connect('/a');

      socket.on('serverConnect', function(data){
	        //console.log(data);
	        $scope.setlandmark('fodaltype', 'uid');
          //socket.emit('msg',{socketid:socket.socket.sessionid, uid:turkNickName.toString(), device:2, setHeader:'asdf'});
	        $scope.setTurkUID = function(){
	          //socket.emit('identify', {uid:$scope.turkuid});
	          socket.emit('identify', {uid:$scope.turkuid,  socketid:socket.socket.sessionid, device:1});

	          document.getElementsByTagName('audio')[0].play();
	          document.getElementsByTagName('audio')[0].pause();
	        };
	        $scope.state = 'connect';
	        $scope.$apply();
      });

      socket.on('joinedroom', function(data){
	        $scope.uid = data.uid;
	        $scope.setlandmark('fodaltype', false);
	        socket.emit('msg', {uid:data.uid, text:'msg', phone:'joined', device:1});
	        $scope.state = 'joined '+data.uid;
	        $scope.$apply();
      });

    socket.on('msg', function(data){
	    console.log(data);

	    if(data.clear){
	      // clear the dirty msg
	      $scope.setlandmark('idle', 'clean');
	      $scope.setlandmark('page', false);
	    }

	    if(data.setHeader){
	      // set the header html
	      $scope.headerHTML = data.setHeader;
	    }

	    if(data.setStatus){
	      // set the status (traffic light)
			  console.log("in setStatus: "+data.setStatus);
	      $scope.status = data.setStatus;
	    }

	  if(data.notify){
	  		//junk code to figure out why I'm not getting notifications
	  		console.log("in notify");
	  	      
	      if($scope.durationFailTimeout){
	        console.log("in timeout");
		      clearTimeout($scope.durationFailTimeout);
		      $scope.durationFailTimeout = false;
		      // clear any other timeouts
		  	  if($scope.ringTimeout) clearTimeout($scope.ringTimeout);
		      if($scope.swipesyFailTimeout) clearTimeout($scope.swipesyFailTimeout);
          
	         // send back interupt data
		  	  socket.emit('msg', {uid:$scope.uid, notifyCreated:$scope.currentNotify.created, interrupt:(new  Date()).getTime()-$scope.currentNotify.localStart, device:1});
	        }
        
        console.log("after timeout code");
	      $scope.currentNotify = data.notify;

	      $scope.missed = '';
	      $scope.setlandmark('idle', 'clean');

	      $scope.durationFailTimeout = setTimeout($scope.durationFail, data.notify.duration);
	      $scope.currentNotify.localStart = (new Date()).getTime();

	      $scope.setlandmark('page', 'ringing');
	      $scope.ringText = data.notify.ring;
        console.log(data.notify.ringDuration);
	      if((data.notify.ringDuration>50)&&(data.notify.duration>50)){
		      $scope.ringTimeout = setTimeout($scope.reject, data.notify.ringDuration);
          console.log("inside ring caller");
		  // play audio
		  document.getElementsByTagName('audio')[0].play();
	      }else{
		  $scope.reject();
	      }
	  }

	  $scope.$apply();
      });

      // ringing accept/reject
      $scope.accept = function(){
	  if($scope.ringTimeout) clearTimeout($scope.ringTimeout);
	  $scope.lastInt = (new Date()).getTime();

	  socket.emit('msg', {uid:$scope.uid, notifyCreated:$scope.currentNotify.created,
			      accept: $scope.lastInt-$scope.currentNotify.localStart, device:1});

	  $scope.currentNotify.acceptTime = $scope.lastInt - $scope.currentNotify.localStart;


	  if((typeof $scope.currentNotify.preview === 'string')
		  &&($scope.currentNotify.preview.length)){
	      $scope.preview();
	  }
	  else if($scope.currentNotify.swipesy>0) $scope.swipesy();
	  else{
	      $scope.fullMessage();
	  }
      };

      $scope.reject = function(byuser){
	  clearTimeout($scope.durationFailTimeout);
	  $scope.durationFailTimeout = false;

	  $scope.setlandmark('state', 'idle');
	  $scope.setlandmark('page', false);
	  var now = (new Date()).getTime();

	  if(byuser){
	      clearTimeout($scope.ringTimeout);
	      $scope.setlandmark('idle', 'clean');
	  }else{
	      $scope.setlandmark('idle', 'dirty');
	      $scope.missed = $scope.currentNotify.missed;
	      $scope.lastInt = now;
	  }
	  socket.emit('msg', {uid:$scope.uid, notifyCreated:$scope.currentNotify.created,
			      reject: now-$scope.currentNotify.localStart,
			      byUserAction:!!byuser, device:1
			     });

	  setTimeout(function(){
	      $scope.$apply();
	  });
      };

      $scope.swipesy = function(){
	  document.getElementsByTagName('audio')[0].pause();
	  if($scope.ringTimeout) clearTimeout($scope.ringTimeout);
	  $scope.setlandmark('page', 'swipesy');
	  var dirs = ['left', 'right', 'up', 'down'];

	  $scope.swipesies = [dirs[Math.floor(Math.random()*4)]];

	  for(var i=1; i<$scope.currentNotify.swipesy;){
	      var a = dirs[Math.floor(Math.random()*4)];
	      if(a !== $scope.swipesies[i-1]) $scope.swipesies[i++] = a;
	  }
	  $scope.currentSwipe = 0;
	  $scope.swipesyFailTimeout = setTimeout($scope.swipesyFail,
						 $scope.currentNotify.swipesyDuration);
      };

      $scope.swipebgstyle = {backgroundColor:'#fff'};

      $scope.swipesying = function(dir, e){
	  if(!$scope.currentNotify) return;
	  var x = e.gesture.deltaX, y = e.gesture.deltaY;
	  // here's where to reposition the arrow if you want
	  if(dir !== 'release'){
	      var glen = (0+(dir==='right')&&(x)) +
		         (0+(dir==='left')&&(-x)) +
		         (0+(dir==='up')&&(-y)) +
		         (0+(dir==='down')&&(y));

	      $scope.swipesysuccessing = false;
	      if((dir === $scope.swipesies[$scope.currentSwipe])&&(glen>88)){
		  $scope.swipebgstyle = {backgroundColor:'#0f0'};
		  $scope.swipesysuccessing = true;
	      }else{
		  $scope.swipebgstyle = {backgroundColor:'#fff'};
		  $scope.swipesysuccessing = false;
	      }
	  }else if($scope.swipesysuccessing){
	      $scope.swipesysuccessing = false;
	      $scope.currentSwipe = $scope.currentSwipe + 1;
	      var now = (new Date()).getTime();

	      if(!$scope.currentNotify.swipesyTimes) $scope.currentNotify.swipesyTimes = [];
	      $scope.currentNotify.swipesyTimes.push(now-$scope.lastInt);
	      $scope.lastInt = now;
	      if($scope.currentSwipe === $scope.currentNotify.swipesy){
		  socket.emit('msg', {uid:$scope.uid, notifyCreated:$scope.currentNotify.created,
				      swipesySuccess:$scope.currentNotify.swipesyTimes, device:1});
		  if($scope.swipesyFailTimeout) clearTimeout($scope.swipesyFailTimeout);
		  $scope.fullMessage();
	      }
	      $scope.swipebgstyle = {backgroundColor:'#fff'};
	      $scope.swipesysuccessing = false;
	  }
      };
      
      $scope.preview = function(){
	  document.getElementsByTagName('audio')[0].pause();
	  $scope.setlandmark('page', 'preview');
	  $scope.messageHeader = $scope.currentNotify.messageHeader;
	  $scope.previewText = $scope.currentNotify.preview;
	  $scope.previewButton = $scope.currentNotify.previewButton;
      };

      $scope.showFromPreview = function(){
	  var now = (new Date()).getTime();
	  socket.emit('msg', {uid:$scope.uid, notifyCreated:$scope.currentNotify.created,
			      previewTime:now-$scope.lastInt, device:1});
	  $scope.lastInt = now;
	  $scope.swipesy();
      };

      $scope.fullMessage = function(){
	  $scope.setlandmark('page', 'message');
	  $scope.messageHeader = $scope.currentNotify.messageHeader;
	  $scope.fullText = $scope.currentNotify.full;
	  $scope.messageButton = $scope.currentNotify.messageButton;
      };

      $scope.doneMessage = function(){
	  clearTimeout($scope.durationFailTimeout);
	  var now = (new Date()).getTime();
	  socket.emit('msg', {uid:$scope.uid, notifyCreated:$scope.currentNotify.created,
			      messageTime:now-$scope.lastInt, device:1});
	  $scope.lastInt = now;
	  $scope.setlandmark('idle', 'clean');	  
	  $scope.setlandmark('page', false);
	  $scope.currentNotify = false;
      };

      $scope.clearDirty = function(){
	  $scope.setlandmark('idle', 'clean');
	  socket.emit('msg', {uid:$scope.uid, notifyCreated:$scope.currentNotify.created,
			      dirtyTime:(new Date()).getTime() - $scope.lastInt, device:1});
	  
	  $scope.currentNotify = false;
      };

      $scope.durationFail = function(){
	  // set to idle dirty, send data
	  $scope.durationFailTimeout = false;
	  var now = (new Date()).getTime();
	  $scope.setlandmark('state', 'idle');
	  $scope.setlandmark('idle', 'dirty');
	  $scope.setlandmark('page', false);
	  $scope.lastInt = now;
	  $scope.missed = $scope.currentNotify.missed;
	  socket.emit('msg', {uid:$scope.uid, notifyCreated:$scope.currentNotify.created,
			      durationFail:now - $scope.currentNotify.localStart, device:1});
	  
	  setTimeout(function(){
	      $scope.$apply();
	  },20);
      };

      $scope.swipesyFail = function(){
	  var now = (new Date()).getTime();
	  $scope.setlandmark('state', 'idle');
	  $scope.setlandmark('idle', 'dirty');
	  $scope.setlandmark('page', false);
	  $scope.lastInt = now;
	  $scope.missed = $scope.currentNotify.missed;
	  socket.emit('msg', {uid:$scope.uid, notifyCreated:$scope.currentNotify.created,
			      swipesyFail:now - $scope.currentNotify.localStart,
			      swipesyProgress: $scope.currentNotify.swipesyTimes, device:1
			     });
	  
	  if($scope.durationFailTimeout) clearTimeout($scope.durationFailTimeout);

	  setTimeout(function(){
	      $scope.swipebgstyle = {backgroundColor:'#fff'};
	      $scope.swipesysuccessing = false;
	      $scope.$apply();
	  },20);
      };


      socket.on('failed', function(data){
	  console.log('failed', data);
	  $scope.setlandmark('fodaltype', 'fail');

	  $scope.state = 'failed';
	  $scope.$apply();
      });


      $scope.$watch('landmarks.page', function(n){
	  if(n !== 'ringing') document.getElementsByTagName('audio')[0].pause();
      });

      $scope.$watch('landmarks.switch', function(n){
	  if(typeof n !== 'undefined') socket.emit('msg', {uid:$scope.uid, switchState:n, device:1});
      });


  });
