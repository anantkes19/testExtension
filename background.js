function sendPageData() {
  //This function will send the save data to the server
  alert("Test Works");

}
function loginToggle() {
  //This function flips around objects viewing between states
  $("#login").toggle();

  $("#username").toggle();
  $("#password").toggle();
  $("#loginSubmit").toggle();
}

function init() {
  //This function ensures things are hidden when they are supposed to be.
  //if login token exists: Send token to server for validation (with username?)
  //If yes, show save, logout and hide login
  //else: hide save, logout and show login

  $("#save").hide();
  $("#logout").hide();
  $("#login").show();

  $("#username").hide();
  $("#password").hide();
  $("#loginSubmit").hide();
}
function loginSubmit() {
  //Send credentials to server
  //If response is yes, login and call login toggle and userloggedin after. Save a cookie to user with their login token (saved on server too)
  loginToggle();
  userStateToggle();
  //If no, error message explaining
}

function userStateToggle() {
  //This function is used for when the user logs in or logs out so proper buttons are shown
  $("#save").toggle();
  $("#login").toggle();
  $("#logout").toggle();
}

function logout() {
  //This function logs a user out

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
