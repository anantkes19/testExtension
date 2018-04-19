function sendPageData() {
  //This function will send the save data to the server
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    console.log(tabs.length);
    var url = tabs[0].url;
    chrome.storage.sync.get(['ccToken', 'email'], function(result) {
      //Start storing the data to variable to send to server
      var data = {};
    	data.email = result.email;
      data.url = url;
      data.token = result.ccToken;

      //Send data to server
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
//This function resets (hides) all of the html elements
function hideAll(){
  $("#login").hide();
  $("#loginInfo").hide();
  $("#save").hide();
  $("#login").hide();
  $("#logout").hide();
  $("#upload").hide();
}

//This function Shows the login page
function logInPage() {
  hideAll();
  $("#loginInfo").show();
}

//This function shows the home page
function homePage() {
  hideAll();
  $("#login").show();
}

//This function shows the logged in page, where a user can save
//a page to their cloud
function loggedInPage() {
  hideAll();
  $("#logout").show();
  $("#save").show();
  $("#upload").show();
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

//This function is a general function to send login data, with or without a
// password
function sendLoginData(email, password, token, login) {
  //Start storing the data to variable to send to server
  var data = {};
	data.email = email;
  userEmail = email;
  data.password = password;
  data.token = token;
  var returnValue;

  //Send data to server
  $.ajax({
	type: 'POST',
	data: JSON.stringify(data),
  contentType: 'application/json',
  url: 'http://24.93.129.131:8080/db/login',
  success: function(data) {
    //console.log(data);
    if(data.authenticated) {
      loggedInPage();
      chrome.storage.sync.set({'ccToken': data.token, 'email':userEmail}, function() {
              console.log('ccToken is set to ' + data.token);
              console.log('email set to ' + userEmail);


              return data.authenticated;
        });
    } else {
      //Give error message that email/password was wrong.
      homePage();
      return false;
    }
  }
});
}


//This function sends a file to the server (PDF)
function sendFile() {
  console.log("Testing Send File");
  chrome.storage.sync.get(['ccToken', 'email'], function(result) {
    console.log(result);
    loggedIn = sendLoginData(result.email, "null", result.ccToken);

    var data = {};
  	data.email = result.email;
    data.password = "Null";
    data.token = result.ccToken;
    data.files = new FormData($("file")[0]);

    var returnValue;
    //It will send the user email, token and the pdfdata
    $.ajax({
    	type: 'POST',
    	data: JSON.stringify(data),
      contentType: 'application/json',
      url: 'http://24.93.129.131:8080/db/upload',
      success: function(data) {
        console.log(data);
        if(data.authenticated) {
          console.log("Data file sent!")

        } else {
          //Give error message that email/password was wrong.
          return false;
        }
      }
    });
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

//This function runs as soon as the chrome extension is loaded
function onLoad() {
  init(); //Call this to check if user logged in


  $("#save").click(sendPageData);
  $("#login").click(logInPage);
  $("#loginSubmit").click(function( event ) {
    event.preventDefault();
    loginSubmit();
  });
  $("#logout").click(logout);
  $("#upload").click(sendFile);
}


$(document).ready(onLoad);
