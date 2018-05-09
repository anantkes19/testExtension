//Set receiver to listen for extension asking if something is highlighted by the user.
function setReceiver () {
  chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('request, ', request);
    if (request.method == "getSelection") {
      console.log(window.getSelection());
      sendResponse({data: window.getSelection().toString()});
    } else {
      sendResponse({}); // snub them.
    }
  });
}

$(document).ready(setReceiver)
