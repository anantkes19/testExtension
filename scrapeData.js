//chrome.tabs.executeScript({
//    code: 'alert("WOO")'
//  });
//chrome.tabs.executeScript(null, {file: "content_script.js"});
var ha = null;
var timer = null;

function checkHa() {
  //var elementExists = document.getElementsByClassName("ha");
  ha = $(".ha")
  console.log(ha)
  if(ha.length) {
    console.log("FOUND IT");
    ha.css("background-color", "blue");
    clearInterval(timer);

  } else {
    console.log("NOT FOUND");
  }
}


function loaded() {
  //console.log("Still Working");
  timer = setInterval(checkHa, 1000);
  //$(".ha").hide();

  //console.log("Should be hidden!");
}
//window.onload = loaded;
$(document).ready(loaded);
