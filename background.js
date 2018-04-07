function sendPageData() {
  //This function will send the save data to the server
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
    console.log(url + " has been sent to the cloud!");
});

}


function loginToggle() {
  //This function flips around objects viewing between states
  $("#loginInfo").toggle();
  $("#login").toggle();


}


function init() {
  //This function ensures things are hidden when they are supposed to be.
  //if login token exists: Send token to server for validation (with username?)
  //If yes, show save, logout and hide login
  //else: hide save, logout and show login
  chrome.storage.sync.get('ccToken', function(result) {
    if(result.ccToken==1234) {
      //Send to server and check if equal, here we do example
      //Login automatically then!
      $("#login").hide();
      $("#loginInfo").hide();

    } else {
      $("#save").hide();
      $("#logout").hide();
      $("#login").show();


    }
    console.log('ccToken was ' + result.ccToken);
  });

}


function loginSubmit() {
  //Send credentials to server
  var data = {};
	data.email = "beep@beep.com";
  data.password = "beep";
  var returnValue;
  $.ajax({
	type: 'POST',
	data: JSON.stringify(data),
  contentType: 'application/json',
  url: 'http://24.93.129.131:8080/db/login',
  success: function(data) {
    if(data.authenticated) {
      data.token = "1234";
      chrome.storage.sync.set({'ccToken': data.token}, function() {
              console.log('ccToken is set to ' + data.token);
              userStateToggle();
              loginToggle();
        });
    } else {
      //Give error message that email/password was wrong.
    }
  }
});
}

function userStateToggle() {
  //This function is used for when the user logs in or logs out so proper buttons are shown
  $("#save").toggle();
  $("#login").toggle();
  $("#logout").toggle();
}


function logout() {
  //This function logs a user out
  chrome.storage.sync.get('ccToken', function(result) {
    console.log('ccToken was ' + result.ccToken);
  });

  //Checking here that it is removed!
  chrome.storage.sync.remove('ccToken', function(result) {
    chrome.storage.sync.get('ccToken', function(result) {
      console.log('ccToken was ' + result.ccToken);
    });
  })
  //Delete stored token client side.
  userStateToggle();
}


function onLoad() {
  init(); //Call this to check if user logged in


  $("#save").click(sendPageData);
  $("#login").click(loginToggle);
  $("#loginSubmit").click(loginSubmit);
  $("#logout").click(logout);
}


$(document).ready(onLoad);
