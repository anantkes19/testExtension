function sendPageData() {
  alert("Test Works");

}
function loginClicked() {
  $("#cloudSaveButton").hide();
  $("#logout").hide();
  $("#login").hide();

  $("#username").show();
  $("#password").show();
}

function loggedIn() {
  $("#cloudSaveButton").show();
  $("#logout").show();
  $("#login").show();

  $("#username").hide();
  $("#password").hide();
}

function onLoad() {
  $("#cloudSaveButton").click(function() {
    alert( "Handler for .click() called." );
  });
  alert( "Alert() called" );

}

$(document).ready(onLoad);
