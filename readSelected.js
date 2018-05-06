
function setReceiver () {
  console.log("Still Working");
  chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('request, ', request);
    if (request.method == "getSelection") {
      console.log('here2');
      console.log(window.getSelection());
      sendResponse({data: window.getSelection().toString()});
    } else {
      sendResponse({}); // snub them.
    }
  });
} 

$(document).ready(setReceiver)