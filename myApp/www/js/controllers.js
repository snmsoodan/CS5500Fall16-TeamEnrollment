angular.module('starter.controllers', ['starter.services','starter.constant','ui.router'])

  .controller('LoginCtrl', function($state,$rootScope,$scope,LoginService) {

    $rootScope.user = null;
    console.log("inside login controller");
    var login = this;
    login.signin = signin;


    function init(){
      getLoginPage();
    }

    function getLoginPage(){
    }

    init();

    function signin(emailId,password){
      // alert('inside signin');
      LoginService.login(emailId,password).then(function(res){
          // alert('inside login service return');
          console.log(res);
          if(res == 'False'){
            // alert('Wrong Username/Password. Try again!');
            login.msg = 'true'
          }
          else{
            // alert('inside correct user');
            // login.msg = 'true'
            $rootScope.user = res;
            $state.go('event');
            login.msg = null;
          }

        },function(err){
        console.log("error");
      })
    }
  })
  .controller('EventCtrl',function($state,$rootScope,$scope,$ionicFilterBar,EventService) {
    // console.log("inside event controller"+$rootScope.user);
    var event = this;
    event.getEvents = getEvents;
    event.eventClick = eventClick;
    event.preferences = preferences;
    event.showFilterBar=showFilterBar;
    var filterBarInstance;
    var a=['../img/ionic.png','../img/NUlogo.png'];

    function init(){
      getEvents($rootScope.user);
    }
    function getEvents(userId){
      EventService.getEvents(userId)
        .then(function(res){
          console.log(res);
          if(res.length != 0){
            for(i=0;i<res.length;i++){
              res[i].pic = a[i];
            }
            $scope.events = res;
          }
          else{
            $scope.events = [];
          }
        })
    }
    init();

    function showFilterBar() {
      filterBarInstance = $ionicFilterBar.show({
        items: $scope.events,
        update: function (filteredItems) {
          $scope.events = filteredItems;
          $scope.array1=filteredItems;
        },
        filterProperties: 'name'
      });
      console.log($ionicFilterBar);
    };

    function eventClick(id){
      $rootScope.eId = id;
      $state.go('eventDetails',{'id':id});
    }

    function preferences(){
      console.log("inside preferences");
      $state.go('preferences.settings');
    }
  })
  .controller('EventDetailsCtrl',function($state,$rootScope,$scope,$stateParams,$cordovaGeolocation,$cordovaSocialSharing,$cordovaCalendar,$ionicPlatform,EventDetailsService) {
    console.log("inside event details controller"+$rootScope.eId);

    var eventDetails=this;
    event.getEventDetails = getEventDetails;
    eventDetails.init=init;
    eventDetails.OtherShare = OtherShare;
    eventDetails.addToCalendar = addToCalendar;

    function init(){
      getEventDetails($rootScope.eId);
      var options = {timeout: 10000, enableHighAccuracy: true};
      $cordovaGeolocation.getCurrentPosition(options).then(function(position){
        var latLng = new google.maps.LatLng($scope.event.Latitude,$scope.event.Longitude);
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
      });
    }

    function getEventDetails(eid){
      EventDetailsService.getEventDetails(eid)
        .then(function(res){
          console.log(res);
          if(res != 'False'){
            $scope.event = res;
          }
          else{
            $scope.event = [];
          }
        })
    }

    init();

    function OtherShare(){
      $ionicPlatform.ready(function(){
        // console.log('inside ionic platform ready');
        try{
          // console.log('inside try');
          if(window.cordova){
            alert("inside cordova");
            $cordovaSocialSharing
              .shareViaFacebookWithPasteMessageHint('Hello', null, 'http://www.google.com')
              .then(function(result) {
                // Success!
                alert('success');
                $scope.share = true;
              }, function(err) {
                // An error occurred. Show a message to the user
                alert('failure'+err);
              });
          }
          else{
            alert('not cordova');
          }
        }
        catch(err){
          alert(err.message);
        }

      });
    }

    function addToCalendar(){
      $cordovaCalendar.createEventInteractively({
        title: $scope.event.Name,
        location: '',
        notes: $scope.event.Description,
        startDate: new Date($scope.event.Date),
        endDate: new Date(2015, 1, 6, 12, 0, 0, 0, 0)
      }).then(function (result) {
        // success
      }, function (err) {
        // error
      });
      $scope.addCal = true;
    }
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
      },
      {
        pic:"/img/ionic.png",
        group:"Northeastern Sports Association",
        id:"345",
        true:"yes",
        change:"The Event will be removed from your preference"
      },
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
            event.events.splice(i,1);
            $scope.msg1="true";
          }else{
            event.makeChange="yes";
            console.log("true no")
            event.events[i].true="yes";
            event.events[i].change="The Event will be removed to your preference";
            $scope.msg1="false";
          }

          // $state.go('preferences.favorites');
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

    cordova.plugins.diagnostic.registerBluetoothStateChangeHandler(function(state){
      // "unknown", "resetting", "unsupported", "unauthorized", "powered_off", "powered_on"
      if (state == "powered_on") {
        $scope.bluetoothIsEnabled = true;
      } else {
        $scope.bluetoothIsEnabled = false;
      }
    });


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
  .controller('allEventsCtrl', function($state,$rootScope,$scope){
    var event=this;
      event.events=[ 
      { 
        pic:"/img/NUlogo.png", 
        group:"Association for Student Welfare", 
        id:"123",     true:"yes", 
        change:"The Event will be removed from your preference"   }, 

        { 
          pic:"/img/ionic.png", 
          group:"Northeastern Sports Association", 
          id:"234",     true:"no", 
          change:"The Event will be added to your preference"   },

           { 
             pic:"/img/ionic.png", 
             group:"Northeastern Sports Association", 
             id:"345",     true:"yes", 
             change:"The Event will be removed from your preference"   }, 
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
            $scope.msg1="true";       }

            else{ 
            event.makeChange="yes"; 
            console.log("true no") 
            event.events[i].true="yes"; 
            event.events[i].change="The Event will be removed to your preference"; 
            $scope.msg1="false"; 
          }  
            // $state.go('preferences.favorites'); 
          } 
      } 
          if(result==="Failure")
          {     $scope.msg="Failure"; 
          } }
            
          console.log("all Events controller")


  })
;

