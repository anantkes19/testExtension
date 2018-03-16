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

$("#cloudSaveButton").click(sendPageData);
