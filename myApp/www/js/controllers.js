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
          // $scope.msg="Success";

        }
      }

      if(result){
        $state.go('event');
      }
      else{
        $scope.msg="Failure";
        login.msg = 'Failure';
      }
    }
  })
  .controller('EventCtrl',function($state,$rootScope,$scope,$ionicFilterBar) {

    var event=this,
      events=[],
     filterBarInstance;

    events=[
      {
        pic:"/img/NUlogo.png",
        name:"NU Homecoming",
        group:"Association for Student Welfare",
        id:"123",
        dt:"11/09/2016"

      },
      {
        pic:"/img/ionic.png",
        name:"Huskies vs Wildcats",
        group:"Northeastern Sports Association",
        id:"234",
        dt:"12/07/2016"

      }
    ]
    event.events=events;
    console.log("inside events controller");
    event.eventClick = eventClick;
    event.preferences = preferences;
    event.showFilterBar=showFilterBar;

    function showFilterBar() {
      filterBarInstance = $ionicFilterBar.show({
        items: event.events,
        update: function (filteredItems) {
          event.events = filteredItems;
        },
        filterProperties: 'name'
      });
    };

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

    function preferences(){
      console.log("inside preferences");
      $state.go('preferences.settings');
    }
  })
  .controller('EventDetailsCtrl',function($state,$rootScope,$scope,$stateParams,$cordovaGeolocation,$cordovaSocialSharing,$cordovaCalendar) {

    var eventDetails=this;


    var events=[
      {
        pic:"/img/NUlogo.png",
        map:"/img/ionic.png",
        name:"NU Homecoming",
        group:"Association for Student Welfare",
        id:"123",
        dt:"11/09/2016",
        desc:"This should be the description of the event. The details are unique to the event",
        lat:"42.338452",
        longt:"-71.087834",
      },
      {
        pic:"/img/ionic.png",
        map:"/img/NUlogo.png",
        name:"Library events",
        group:"Sigma Kappa",
        id:"234",
        dt:"12/17/2016",
        desc:"This should be the description of the event. The details are unique to the event",
        lat:"42.338628",
        longt:"-71.092285",
      }

    ];
    eventDetails.init=init;
    eventDetails.OtherShare = OtherShare;
<<<<<<< HEAD
=======
    eventDetails.addToCalendar = addToCalendar;
>>>>>>> d31b728e59e48eefaa97edf544f1071ba3501b92

    var id=$stateParams.id;
    console.log("after id"+id);
    function init() {

      console.log("inside event details init");

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
<<<<<<< HEAD
    // function share(){
    //
    //   $cordovaSocialSharing
    //     .shareViaFacebook('Hello', null, 'http://test.com')
    //     .then(function(result) {
    //       alert('success');
    //     }, function(err) {
    //       alert('error');
    //       // An error occurred. Show a message to the user
    //     });
    //
    //
    //
    // }

    function OtherShare(){
      // window.plugins.socialsharing.share('Digital Signature Maker', null, null, 'https://play.google.com/store/apps/details?id=com.prantikv.digitalsignaturemaker');

      // $cordovaSocialSharing.share('Digital Signature Maker', null, null, 'https://play.google.com/store/apps/details?id=com.prantikv.digitalsignaturemaker');
      // $scope.share = 'true';


      // this is the complete list of currently supported params you can pass to the plugin (all optional)
      var options = {
        message: 'Try NU Events', // not supported on some apps (Facebook, Instagram)
        subject: 'the subject', // fi. for email
        files: ['', ''], // an array of filenames either locally or remotely
        url: 'https://www.website.com/foo/#bar?a=b',
        chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
      }

      var onSuccess = function(result) {
        console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
        console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
      }

      var onError = function(msg) {
        console.log("Sharing failed with message: " + msg);
      }

      window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
      $scope.share = 'true';

    }

    function addToCalendar(){
      $cordovaCalendar.createEventInteractively({
        title: 'Test',
        location: 'Test',
        notes: 'Test',
        startDate: new Date(2015, 0, 6, 18, 30, 0, 0, 0),
        endDate: new Date(2015, 1, 6, 12, 0, 0, 0, 0)
      }).then(function (result) {
        // success
      }, function (err) {
        // error
      });
      $scope.calendar = 'true';
    }

=======

    function OtherShare(){

      console.log("inside other share");

      // window.plugins.socialsharing.share('Digital Signature Maker', null, null, 'https://play.google.com/store/apps/details?id=com.prantikv.digitalsignaturemaker');

      $cordovaSocialSharing.share('Digital Signature Maker', null, null, 'https://play.google.com/store/apps/details?id=com.prantikv.digitalsignaturemaker');
      // $scope.share = 'true';


      // this is the complete list of currently supported params you can pass to the plugin (all optional)
      // var options = {
      //   message: 'Try NU Events', // not supported on some apps (Facebook, Instagram)
      //   subject: 'the subject', // fi. for email
      //   files: ['', ''], // an array of filenames either locally or remotely
      //   url: 'https://www.website.com/foo/#bar?a=b',
      //   chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
      // }
      //
      // var onSuccess = function(result) {
      //   console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
      //   console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
      // }
      //
      // var onError = function(msg) {
      //   console.log("Sharing failed with message: " + msg);
      // }
      //
      // window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
      $scope.share = 'true';

    }

    function addToCalendar() {
      alert('inside addtocalendar');
      console.log("inside addtocalendar");


      $ionicPlatform.ready(function() {
        $cordovaCalendar.createEventInteractively({
          title: 'Test',
          location: 'Test',
          notes: 'Test',
          startDate: new Date(2015, 0, 6, 18, 30, 0, 0, 0),
          endDate: new Date(2015, 1, 6, 12, 0, 0, 0, 0)
        }).then(function (result) {
          alert("successfully added");
        }, function (err) {
          alert("unsuccessful addition");
        });
      });

        $scope.calendar = 'true';

    }
>>>>>>> d31b728e59e48eefaa97edf544f1071ba3501b92
    console.log("inside events details controller");
})
  .controller('PreferencesCtrl', function($state,$rootScope,$scope){
  console.log("inside preferences ctrl");



  })
  .controller('FavCtrl', function($state,$rootScope,$scope){

    var event=this;

    event.events=[
      {
        pic:"/img/NUlogo.png",
        group:"Association for Student Welfare",
        id:"123",
        true:"yes",
        change:"The Event will be removed from your preference"
      },
      {
        pic:"/img/ionic.png",
        group:"Northeastern Sports Association",
        id:"234",
        true:"no",
        change:"The Event will be added to your preference"
      }
    ]
    event.alterFavourite=alterFavourite;

    function alterFavourite(id) {
      console.log("inside alterFavourite");
      var result="Failure";
      for(var i in event.events){
        if(event.events[i].id===id){
          result="Success";
          if(event.events[i].true==="yes"){
            console.log("true yes")
            event.makeChange="no";
            event.events[i].true="no";
            event.events[i].change="The Event will be added from your preference";
          }else{
            event.makeChange="yes";
            console.log("true no")
            event.events[i].true="yes";
            event.events[i].change="The Event will be removed to your preference";
          }

          $state.go('preferences.favorites');
        }
      }
      if(result==="Failure"){
        $scope.msg="Failure";
      }
    }

    console.log("favorite controller")

  })
  .controller('SettingsCtrl', function($state,$rootScope,$scope){
    console.log("inside settings controller");
    $scope.notification = {checked : true};
    $scope.bluetooth = {checked : true};
    $scope.location = {checked : true};

    var settings = this;
    // this.notificationChange = notificationChange;
    // this.bluetoothChange = bluetoothChange;
    // this.locationChange = locationChange;
    this.favoritesPage = favoritesPage;
    this.allEventsPage = allEventsPage;
    this.eventPage = eventPage;

    // function notificationChange(){
    //   console.log("notification "+$scope.notification.checked);
    //
    // }
    // function bluetoothChange(){
    //   console.log("bluetooth "+$scope.bluetooth.checked);
    //
    // }
    // function locationChange(){
    //   console.log("location "+$scope.location.checked);
    //
    // }
    //
    //

    function favoritesPage(){
      $state.go('preferences.favorites');
    }

    function allEventsPage(){
      $state.go('preferences.events');
    }
    function eventPage(){
      $state.go('event');
    }

  })
;

