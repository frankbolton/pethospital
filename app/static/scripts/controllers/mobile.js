'use strict';

angular.module('ktz')
  .controller('MobileCtrl', function ($scope, $http) {


      $scope.landmarks = {state:'idle'};

      $scope.setlandmark = function(k,v){
	  $scope.landmarks[k] = v;
      };

      var socket = io.connect('/a');

      socket.on('serverConnect', function(data){
	  //console.log(data);
	  $scope.setlandmark('fodaltype', 'uid');

	  $scope.setTurkUID = function(){
	      //socket.emit('identify', {uid:$scope.turkuid});
	      socket.emit('identify', {uid:$scope.turkuid,  socketid:socket.socket.sessionid});

	      document.getElementsByTagName('audio')[0].play();
	      document.getElementsByTagName('audio')[0].pause();
	  };
	  $scope.state = 'connect';
	  $scope.$apply();
      });

      socket.on('joinedroom', function(data){
	  $scope.uid = data.uid;
	  $scope.setlandmark('fodaltype', false);
	  socket.emit('msg', {uid:data.uid, text:'msg'});

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
	      $scope.status = data.setStatus;
	  }

	  if(data.notify){	      
	      if($scope.durationFailTimeout){
		  clearTimeout($scope.durationFailTimeout);
		  $scope.durationFailTimeout = false;

		  // clear any other timeouts
		  if($scope.ringTimeout) clearTimeout($scope.ringTimeout);
		  if($scope.swipesyFailTimeout) clearTimeout($scope.swipesyFailTimeout);

	      	  // send back interupt data
		  socket.emit('msg', {uid:$scope.uid, notifyCreated:$scope.currentNotify.created,
				      interrupt:(new Date()).getTime()-$scope.currentNotify.localStart
				     });
	      }
	      
	      $scope.currentNotify = data.notify;

	      $scope.missed = '';
	      $scope.setlandmark('idle', 'clean');

	      $scope.durationFailTimeout = setTimeout($scope.durationFail, data.notify.duration);
	      $scope.currentNotify.localStart = (new Date()).getTime();

	      $scope.setlandmark('page', 'ringing');
	      $scope.ringText = data.notify.ring;

	      if((data.notify.ringDuration>50)&&(data.notify.duration>50)){
		  $scope.ringTimeout = setTimeout($scope.reject, data.notify.ringDuration);

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
			      accept: $scope.lastInt-$scope.currentNotify.localStart});

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
			      byUserAction:!!byuser
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
				      swipesySuccess:$scope.currentNotify.swipesyTimes});
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
			      previewTime:now-$scope.lastInt});
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
			      messageTime:now-$scope.lastInt});
	  $scope.lastInt = now;
	  $scope.setlandmark('idle', 'clean');	  
	  $scope.setlandmark('page', false);
	  $scope.currentNotify = false;
      };

      $scope.clearDirty = function(){
	  $scope.setlandmark('idle', 'clean');
	  socket.emit('msg', {uid:$scope.uid, notifyCreated:$scope.currentNotify.created,
			      dirtyTime:(new Date()).getTime() - $scope.lastInt});
	  
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
			      durationFail:now - $scope.currentNotify.localStart});
	  
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
			      swipesyProgress: $scope.currentNotify.swipesyTimes
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
	  if(typeof n !== 'undefined') socket.emit('msg', {uid:$scope.uid, switchState:n});
      });


  });
