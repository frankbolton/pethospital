'use strict';
console.log('in desktop.js');
angular.module('ktz')
  .controller('DesktopCtrl', function ($scope, $http) {
     
      console.log('in function inside desktop.js');
      var socket = io.connect('/a');
 	  console.log(socket.id);
      window.socket = socket;

      socket.on('serverConnect', function(data){
	  console.log(socket.sessionid);
	  console.log('connect', data);
	  // show fodal, require uid
	  // move this into a resolve
	  $scope.setlandmark('fodaltype', 'uid');

	  $scope.setTurkUID = function(){
	      //add element to provide unique ID socket.emit('identify', {uid:$scope.turkuid});
	       socket.emit('identify', {uid:$scope.turkuid, socketid:socket.socket.sessionid, device:2});
	      console.log(socket);
	      console.log(socket.socket.sessionid);
	  };
	  $scope.$apply();
      });

      socket.on('joinedroom', function(data){

	  $scope.setlandmark('fodaltype', false);
	  $scope.uid = data.uid;
	  socket.emit('msg', {uid:$scope.uid, text:'msg', device:2});
	  $scope.$apply();
      });

      socket.on('msg', function(data){
	  console.log(data);
      });


      socket.on('failed', function(data){
	  console.log('failed', data);
	  $scope.setlandmark('fodaltype', 'fail');
	  $scope.$apply();
      });

      $scope.setStatus = function(state){
	  //socket.emit('msg', {uid:$scope.uid, setStatus:state});
	  socket.emit('msg', {uid:$scope.uid, setStatus:state, socketid:socket.socket.sessionid, device:2});
	  console.log('setStatus: ', state);
      };

      $scope.setHeader = function(){
	  socket.emit('msg', {uid:$scope.uid, setHeader:$scope.header,device:2});
	  $scope.header = '';
      };

      $scope.note = {
	  messageButton:'Done',
	  previewButton:'Show'
      };

      $scope.notify = function(){
// without angular, here you may need to explicitly pull values from the inputs

	  $scope.note.created = (new Date()).getTime();
	  socket.emit('msg', {uid:$scope.uid, notify:$scope.note, device:2});

// comment during testing for lazy!
	  //$scope.note = {messageButton:'Done', previewButton:'Show'};
      };

      $scope.landmarks = {};

      $scope.setlandmark = function(k,v){
	  if($scope.landmarks[k] === v) delete $scope.landmarks[k];
	  else $scope.landmarks[k] = v;
      };


      // example of mapping this out of angular
      window.setStatus = $scope.setStatus;
      window.setHeader = $scope.setHeader;
      window.notify = $scope.notify;
      // console##: setStatus(false)
      // function setStatus(state){ ... exact copypasta ... }




  });
