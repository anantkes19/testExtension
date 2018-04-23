const URL='http://137.146.142.97:8080/';

function sendPageData() {
  //This function will send the save data to the server
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    console.log(tabs.length);
    var url = tabs[0].url;
    chrome.storage.sync.get(['ccToken', 'email'], function(result) {
      var data = {};
    	data.email = result.email;
      data.url = url;
      data.token = result.ccToken;
      //var returnValue;
      $.ajax({
      	type: 'POST',
      	data: JSON.stringify(data),
        contentType: 'application/json',
        url: 'http://24.93.129.131:8080/db/getURL',
        success: function(data) {
          console.log(data);
          if(data.authenticated) {
            console.log("Article Saved!");
          } else {
            //Give error message that email/password was wrong.
          }
        }
      });
    });

    console.log(url + " has been sent to the cloud!");
  });

}

function hideAll(){
  $("#login").hide();
  $("#loginInfo").hide();
  $("#save").hide();
  $("#login").hide();
  $("#logout").hide();
}

function logInPage() {
  hideAll();
  $("#loginInfo").show();
}

function homePage() {
  hideAll();
  $("#login").show();
}

function loggedInPage() {
  hideAll();
  $("#logout").show();
  $("#save").show();
}

function init() {
  //This function ensures things are hidden when they are supposed to be.
  //if login token exists: Send token to server for validation (with username?)
  //If yes, show save, logout and hide login
  //else: hide save, logout and show login
  chrome.storage.sync.get(['ccToken', 'email'], function(result) {
    console.log(result);
    loggedIn = sendLoginData(result.email, "null", result.ccToken);
    if(loggedIn) {
      loggedInPage();
    } else {
      homePage();
    }
  });

}

function sendLoginData(email, password, token) {
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

      chrome.storage.sync.set({'ccToken': data.token, 'email':userEmail}, function() {
              console.log('ccToken is set to ' + data.token);
              console.log('email set to ' + userEmail);
              loggedInPage();
              return data.authenticated;
        });
    } else {
      //Give error message that email/password was wrong.
      return false;
    }
  }
});
}

function loginSubmit() {
  //Send credentials to server
	email = $("#username").val();
  password = $("#password").val();
  token = "0000";
  sendLoginData(email, password, token);
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
  homePage();
}


function onLoad() {
  init(); //Call this to check if user logged in


  $("#save").click(sendPageData);
  $("#login").click(logInPage);
  $("#loginSubmit").click(function( event ) {
    event.preventDefault();
    loginSubmit();
  });
  $("#logout").click(logout);
}


$(document).ready(onLoad);
