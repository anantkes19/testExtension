const URL='http://137.146.142.97:8080/';

function sendPageData() {
  //This function will send the save data to the server
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
    console.log(url + " has been sent to the cloud!");
});

}


function loginToggle() {
  //This function flips around objects viewing between states
  $("#login").toggle();

  $("#loginInfo").toggle();
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

      $("#loginInfo").hide();

    }
    console.log('ccToken was ' + result.ccToken);
  });

}


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
