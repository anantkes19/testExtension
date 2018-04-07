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
  chrome.storage.sync.get(['ccToken', 'email'], function(result) {
    console.log(result);
    sendLoginData(result.email, "null", result.ccToken, true);

  });

}

function sendLoginData(email, password, token, initPhase) {
  var data = {};
	data.email = email;
  userEmail = email;
  data.password = password;
  data.token = token;
  var returnValue;
  $.ajax({
	type: 'POST',
	data: JSON.stringify(data),
  contentType: 'application/json',
  url: 'http://24.93.129.131:8080/db/login',
  success: function(data) {
    console.log(data);
    if(data.authenticated) {
      if(initPhase) {
        $("#login").hide();
        $("#loginInfo").hide();
        return;
      }

      chrome.storage.sync.set({'ccToken': data.token, 'email':userEmail}, function() {
              console.log('ccToken is set to ' + data.token);
              console.log('email set to ' + userEmail);
              userStateToggle();
              loginToggle();
        });
    } else {
      //Give error message that email/password was wrong.
    }
  }
});
}

function loginSubmit() {
  //Send credentials to server
	email = $("#username").val();
  password = $("#password").val();
  token = "0000";
  sendLoginData(email, passord, token);
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
  $("#loginSubmit").click(function( event ) {
    event.preventDefault();
    loginSubmit();
  });
  $("#logout").click(logout);
}


$(document).ready(onLoad);
