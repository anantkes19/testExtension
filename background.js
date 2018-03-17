function sendPageData() {
  alert("Test Works");

}
function loginClicked() {
  $("#save").hide();
  $("#logout").hide();
  $("#login").hide();

  $("#username").show();
  $("#password").show();
  $("#loginSubmit").show();
}

function loggedIn() {
  $("#save").show();
  $("#logout").show();
  $("#login").show();

  $("#username").hide();
  $("#password").hide();
  $("#loginSubmit").hide();
}

function onLoad() {
  $("#save").click(sendPageData);

  loggedIn(); //Call this to hide log in info.

  $("#login").click(loginClicked);

  $("#loginSubmit").click(loggedIn);

}


$(document).ready(onLoad);
