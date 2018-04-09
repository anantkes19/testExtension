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

<<<<<<< HEAD

function loginSubmit() {
  //Send credentials to server
  console.log($('#username').val());
  console.log($('#password').val());
  const data = {
    email: $('#username').val(),
    password: $('#password').val(),
  }
  $.ajax({
    type: "POST",
    url: `${URL}db/login/`,
    data: data,
    dataType: 'jsonp',
    contentType: "application/json",
  }).always(function (xhr, statusText, data) {
    // $("#encoded").html(data.encoded);
    console.log(xhr);
    console.log(xhr.status);
    console.log(data);
    var token = 1234; //Token should be what the server returns, here is an example of 1234
    chrome.storage.sync.set({'ccToken': token}, function() {
      console.log('ccToken is set to ' + token);
    });
    loginToggle();
    userStateToggle();
  })
  // .fail(function (xhr, status, error) {
  //     // $("#error").html("Could not reach the API: " + error);
  //     console.log(error);
  // });
=======
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
>>>>>>> 5313796b7387cba6b444fd0f7e91e7593265ba68
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
