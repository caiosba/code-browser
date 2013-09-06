var pollInterval = 10000;
var jobID;
var timer;
var callback;

function setJobID(id, func) {
  jobID = id;
  callback = func;
  startRequest();
}

function checkStatus() {
  if (jobID) {
    var req = new XMLHttpRequest();
    req.open("GET", 'http://localhost:3000/repositories/' + jobID + '.json', true);
    req.onreadystatechange = function(e) {
      if (req.readyState === 4) {
        if (req.status === 200 || req.status === 201) {
          var json = JSON.parse(req.responseText);
          if (json.data) {
            // alert('Ready!');
            chrome.browserAction.setIcon({ 'path' : 'icon-green.png' });
            callback.apply(this, [json.tool, JSON.parse(json.data)]);
            jobID = null;
            window.clearTimeout(timer);
          }
        } else {
          chrome.browserAction.setIcon({ 'path' : 'icon-red.png' });
          jobID = null;
          window.clearTimeout(timer);
        }
      }
    };
    req.send();
  }
}

function startRequest() {
  if (jobID) {
    checkStatus();
    timer = window.setTimeout(startRequest, pollInterval);
  }
}
