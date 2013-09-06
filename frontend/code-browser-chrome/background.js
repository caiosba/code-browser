var pollInterval = 10000;
var jobID;
var timer;

function setJobID(id) {
  jobID = id;
  startRequest();
}

function checkStatus() {
  if (jobID) {
    var fgPage = chrome.extension.getViews({ type : 'popup' })[0];
    var req = new XMLHttpRequest();
    req.open("GET", 'http://localhost:3000/repositories/' + jobID + '.json', true);
    req.onreadystatechange = function(e) {
      if (req.readyState === 4) {
        if (req.status === 200 || req.status === 201) {
          var json = JSON.parse(req.responseText);
          if (json.data) {
            chrome.browserAction.setIcon({ 'path' : 'icon-green.png' });
            clearTimeout(timer);
          }
        } else {
          chrome.browserAction.setIcon({ 'path' : 'icon-red.png' });
          clearTimeout(timer);
        }
      }
    };
    req.send();
  }
}

function startRequest() {
  checkStatus();
  timer = window.setTimeout(startRequest, pollInterval);
}
