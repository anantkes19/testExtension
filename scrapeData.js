var ha = null;
var timer = null;


function sendGmail() {
  content = $(".a3s:not(.undefined)").text();
  headerInfo = $(".hP").text();
  console.log("Sending Gmail info");
  console.log(headerInfo);
  console.log(content);

  chrome.runtime.sendMessage({
    msg: "gmailInfo",
    data: {
        subject: headerInfo, //Subject of email
        content: content //Content of email
    }
  });

}


//As gmail dynamically loads we check every second to find the header or (Ha) class, where the buttons are.
function checkHa() {

  ha = $(".G-tF")
  sendButton = $(".classifiedCloudSend");
  sendButton.remove()
  console.log(ha)
  if(ha.length) {
    console.log("FOUND IT");
    ha.append( "<div class='classifiedCloudSend T-I J-J5-Ji T-I-Js-Gs ar7 mw T-I-ax7 L3'><span class='asa'>Upload To CC</span></div>" );

    sendButton = $(".classifiedCloudSend");

    sendButton.click(sendGmail);
    clearInterval(timer);

  } else {
    console.log("NOT FOUND");
  }
}

function setReceiver () {
  //console.log("Still Working");
  chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('request, ', request);
    if (request.method == "newGmail") {
      console.log('test');
      testHa = $(".G-tF").length
      if(testHa) {
        ha = null;
        clearInterval(timer);
        sendButton = $(".classifiedCloudSend");
        sendButton.remove()
        timer = setInterval(checkHa, 1000);
      }

    } else {
      return;
    }
  });
}

function loaded() {

  setReceiver();
  timer = setInterval(checkHa, 1000);

  //console.log("Should be hidden!");
}
//window.onload = loaded;
$(document).ready(loaded);
