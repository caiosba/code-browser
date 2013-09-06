var bgPage = chrome.extension.getBackgroundPage();

var codeBrowserGenerator = {
  
  requestData: function() {
    document.getElementById('url').innerHTML = localStorage.codeBrowserURL;
    document.getElementById('status').innerHTML = 'Waiting for data...';
    var req = new XMLHttpRequest();
    req.open("POST", 'http://localhost:3000/repositories.json', true);
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.onreadystatechange = function(e) {
      if (req.readyState === 4) {
        if (req.status === 200 || req.status === 201) {
          document.getElementById('status').innerHTML = 'Job Queued';
          codeBrowserGenerator.changeIcon('yellow');
          var json = JSON.parse(req.responseText);
          if (json.id) {
            bgPage.setJobID(json.id);
          }
        } else {
          document.getElementById('status').innerHTML = 'Error: ' + req.statusText;
          codeBrowserGenerator.changeIcon('red');
        }
      }
      delete localStorage.codeBrowserURL;
    };
    req.send('url=' + encodeURIComponent(localStorage.codeBrowserURL));
  },

  changeIcon: function(color) {
    chrome.tabs.query({ 'active' : true }, function(tab){
      var url = tab[0].url;
      chrome.browserAction.setIcon({ 'path' : 'icon-' + color + '.png' });
    });
  },

  valid: function(url) {
    return /^https?:\/\/github\.com\/.*$/.test(url);
  }

};

// Run our generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT }, function(tabs) {
    if (!localStorage.codeBrowserURL) {
      if (codeBrowserGenerator.valid(tabs[0].url)) {
        localStorage.codeBrowserURL = tabs[0].url;
        codeBrowserGenerator.changeIcon('blue');
        codeBrowserGenerator.requestData();
      }
      else {
        codeBrowserGenerator.changeIcon('gray');
      }
    }
    else {
      document.getElementById('url').innerHTML = localStorage.codeBrowserURL;
    }
  });
});
