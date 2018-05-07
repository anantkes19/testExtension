// const URL='http://137.146.142.97:8080/';
const URL='http://localhost:8080/';

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
      data.people = [data.email];
      data.title = "";
      //for x in textbox:
      $('.emailTextbox').each(function(i){

        email = $(this).val();
        if(email != "") {
          data.people.push(email);
        }

        if (i==0)
        {
          $(this).val("");  // don't remove first textbox, just clear it
          return; //continue
        }
        this.remove(); // remove all others
      });
      // Send data to server
      console.log("Saving page...");
      chrome.tabs.sendMessage(tabs[0].id, {method: "getSelection"}, function(response){
        // sendServiceRequest(response.data);
        data.description = response.data

        //This needs to be moved inside the success function
      $( "#success" ).fadeIn(1000, function() {
        $("#success").fadeOut(1500);
      });
      $.ajax({
      	type: 'POST',
      	data: JSON.stringify(data),
        contentType: 'application/json',
        url: 'http://localhost:8080/db/getURL',
        success: function(data) {
          console.log("Page Saved!");
          console.log(data);
          if(data.authenticated) {
            console.log("Article Saved!");

          } else {
            console.log("Error: Email/Password was incorrect");
            //Give error message that email/password was wrong.
          }
        },
        error: function() {
        $( "#serverFailure" ).fadeIn(1000, function() {
          $("#serverFailure").fadeOut(1500);
          })
        }
      });
      });
    });

    // console.log(url + " has been sent to the cloud!");
  });

}

// this function adds another textbox so the user can share
// the page with another person
function addPerson(){
  var copy = '<input type="text" class="emailTextbox">';
  $("#shareWith").append(copy);
  $("#addAnotherEmail").appendTo("#shareWith");
}

//This function resets (hides) all of the html elements
function hideAll(){
  $("#login").hide();
  $("#loginInfo").hide();
  $("#save").hide();
  $("#login").hide();
  $("#logout").hide();
  //$("#upload").hide();
  $("#shareWith").hide();
  $("#success").hide();
  $("#failure").hide();
  $("#serverFailure").hide();

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
  //$("#upload").show();
  $("#shareWith").show();
}

//This function ensures things are hidden when they are supposed to be.
//if login token exists: Send token to server for validation (with username?)
//If yes, show save, logout and hide login
//else: hide save, logout and show login
function init() {
  chrome.storage.sync.get(['ccToken', 'email'], function(result) {
    console.log(result);
    //sendLoginData(result.email, "null", result.ccToken, true);
    loggedInPage(); //Remove me soon
  });
}

// This function is a general function to send login data, with or without a
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
  url: 'http://localhost:8080/db/login',
  success: function(data) {
    //console.log(data);
    if(data.authenticated) {
      if(login) {
        loggedInPage();
      }
      chrome.storage.sync.set({'ccToken': data.token, 'email':userEmail}, function() {
              console.log('ccToken is set to ' + data.token);
              console.log('email set to ' + userEmail);


              return data.authenticated;
        });
    } else {
      $( "#failure" ).fadeIn(1000, function() {
        $("#failure").fadeOut(1500);
      });
      return false;
    }
  }
});
}


//This function sends a file to the server (PDF)

//Does Not Work
function sendFile() {
  console.log("Testing Send File");
  chrome.storage.sync.get(['ccToken', 'email'], function(result) {
    //console.log(result);
    loggedIn = sendLoginData(result.email, "null", result.ccToken, false);

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
      url: 'http://localhost:8080/db/upload',
      success: function(data) {
        console.log(data);
        if(data.authenticated) {
          console.log("Data file sent!")

        } else {
          console.log("Error: Email/Password was incorrect");
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
  chrome.storage.sync.remove('ccToken', function(result) {
    console.log("Token removed");
  })
  //Delete stored token client side.
  homePage();
}

function setGmailReceiver() {
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.msg === "gmailInfo") {
            //  To do something
            sendGmail(request.data)
            //console.log(request.data.subject)
            //console.log(request.data.content)
        }
    }
  );
}

function sendGmail(gmailData) {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    console.log(tabs.length);
    var url = tabs[0].url;
    chrome.storage.sync.get(['ccToken', 'email'], function(result) {
      //Start storing the data to variable to send to server
      var data = {};
      data.email = result.email;
      data.url = url;
      data.token = result.ccToken;
      data.people = [data.email];
      data.title = gmailData.subject;
      data.description = gmailData.content;
      // Send data to server

      $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: 'http://localhost:8080/db/getURL',
        success: function(data) {
          console.log("Email Saving!!");
          //console.log(data);
          if(data.authenticated) {
            console.log("Email Saved!");

          } else {
            //Give error message that email/password was wrong.
            console.log("Error: Email/Password was incorrect");
          }
        }
      });

    });
  });
}

//This function runs as soon as the chrome extension is loaded
function onLoad() {
  hideAll();
  init(); //Call this to check if user logged in
  setGmailReceiver();

  $("#save").click(sendPageData);
  $("#login").click(logInPage);
  $("#loginSubmit").click(function( event ) {
    event.preventDefault();
    loginSubmit();
  });
  $("#logout").click(logout);
  //$("#upload").click(sendFile);
  $("#addAnotherEmail").click(addPerson);
}




$(document).ready(onLoad);
