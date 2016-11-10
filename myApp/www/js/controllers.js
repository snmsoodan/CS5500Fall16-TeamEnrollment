angular.module('starter.controllers', ['ui.router'])

  .controller('LoginCtrl', function($state,$rootScope,$scope) {

    //adding $scope.title for Jasmine testing purposes//
    $scope.title = 'testing';

    var users=[
      {username: "alice@husky.neu.edu",    password: "alice",    },
      {username: "bob@northeastern.neu.edu",      password: "bob",      },
      {username: "charley@neu.edu",   password: "charley",   },
      {username: "jannunzi", password: "jannunzi"}
    ]
    console.log("inside login controller");
    var login = this;
    login.signin = signin;


    function signin(emailId,password) {
      console.log("inside signin function");

      for(var i in users){
        // console.log(i);
        if(users[i].username===emailId&&users[i].password===password){
          // $state.go('event');
          var result=true;
          $scope.msg="Success";

        }
      }

      if(result){
        $state.go('event');
      }
      else{
        $scope.msg="Failure";
      }
    }
  })
  .controller('EventCtrl',function($state,$rootScope,$scope) {

    var event=this;

    event.events=[
      {
        pic:"/android_asset/www/img/NUlogo.png",
        name:"NU Homecoming",
        group:"Association for Student Welfare",
        id:"123",
        dt:"11/09/2016"

      },
      {
        pic:"/android_asset/www/img/ionic.png",
        name:"Huskies vs Wildcats",
        group:"Northeastern Sports Association",
        id:"234",
        dt:"12/07/2016"

      }
    ]
    console.log("inside events controller");
    var event = this;
    event.eventClick = eventClick;

    function eventClick(id) {
      console.log("inside eventClick");
      var result="Failure";
      for(var i in event.events){
        if(event.events[i].id===id){
          result="Success";
          $state.go('eventDetails',{'id':id});
        }
      }
      if(result==="Failure"){
        $scope.msg="Failure";
      }
    }
  })
  .controller('EventDetailsCtrl',function($state,$rootScope,$scope,$stateParams,$cordovaGeolocation) {

  var eventDetails=this;

  var events=[
    {
      pic:"/android_asset/www/img/NUlogo.png",
      map:"/android_asset/www/img/ionic.png",
      name:"NU Homecoming",
      group:"Association for Student Welfare",
      id:"123",
      dt:"11/09/2016",
      desc:"This should be the description of the event. The details are unique to the event"
    },
    {
      pic:"/android_asset/www/img/ionic.png",
      map:"/android_asset/www/img/NUlogo.png",
      name:"Library events",
      group:"Sigma Kappa",
      id:"234",
      dt:"12/17/2016",
      desc:"This should be the description of the event. The details are unique to the event"
    }

  ];
  eventDetails.init=init;
  var id=$stateParams.id;
  console.log("after id"+id);

    function init() {

      console.log("inside event details init");

      eventDetails.shareOnFb = false;
      eventDetails.addToCalendar = false;


      for(var i in events){
        if(events[i].id===id){
          console.log("id matched "+id);
          eventDetails.event=events[i];
          console.log(eventDetails.event);
        }
      }
      var options = {timeout: 10000, enableHighAccuracy: true};

      $cordovaGeolocation.getCurrentPosition(options).then(function(position){
        var latLng = new google.maps.LatLng(eventDetails.event.lat,eventDetails.event.longt);
        var mapOptions = {
          center: latLng,
          zoom: 17,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        google.maps.event.addListenerOnce($scope.map, 'idle', function(){
          var marker = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            position: latLng
          });
        });

        eventDetails.mapLoaded = true;
      }, function(error){
        console.log("Could not get location");
        eventDetails.mapLoaded = false;
      });}
  init();
  console.log("inside events details controller");

})

;
