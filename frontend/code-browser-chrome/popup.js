var bgPage = chrome.extension.getBackgroundPage();

var codeBrowserGenerator = {
  
  requestData: function() {
    var that = this;
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
            bgPage.setJobID(json.id, function(tool, data) {
              that.renderChart[tool](data);
              document.getElementById('status').innerHTML = 'Chart rendered!';
            });
          }
        } else {
          document.getElementById('status').innerHTML = 'Error: ' + req.statusText;
          codeBrowserGenerator.changeIcon('red');
        }
      }
      delete localStorage.codeBrowserURL;
    };
    req.send('url=' + encodeURIComponent(localStorage.codeBrowserURL) + '&tool=' + document.getElementById('viz').value);
  },

  changeIcon: function(color) {
    chrome.tabs.query({ 'active' : true }, function(tab){
      var url = tab[0].url;
      chrome.browserAction.setIcon({ 'path' : 'icon-' + color + '.png' });
    });
  },

  valid: function(url) {
    return /^https?:\/\/github\.com\/.*$/.test(url);
  },

  // Render a chart for each tool
  renderChart: {

    'gitshortlog' : function(data) {
      var labels = {};
      var values = [];
      document.getElementById('chart').innerHTML = '<ul>';
      for (var name in data) {
        document.getElementById('chart').innerHTML += '<li>' + name + ': ' + data[name] + '</li>';
        labels[data[name]] = name;
        values.push(parseInt(data[name], 10));
      }
      document.getElementById('chart').innerHTML += '</ul>';
      var chart = d3.select("body").append("div").attr("class", "chart-commits");
      var x = d3.scale.linear().domain([0, d3.max(values)]).range(["0px", "350px"]); 
      chart.selectAll("div").data(values).enter().append("div").style("width", x).text(function(d) { return labels[d] + ' ('+ d + ')'; });
    },

    'gitlineschanged' : function(data) {
      var labels = {};
      var values = [];
      document.getElementById('chart').innerHTML = '<ul>';
      for (var name in data) {
        document.getElementById('chart').innerHTML += '<li>' + name + ': ' + data[name] + '</li>';
        labels[data[name]] = name;
        values.push(parseInt(data[name], 10));
      }
      document.getElementById('chart').innerHTML += '</ul>';
      var chart = d3.select("body").append("div").attr("class", "chart-lines");
      var x = d3.scale.linear().domain([0, d3.max(values)]).range(["0px", "350px"]); 
      chart.selectAll("div").data(values).enter().append("div").style("width", x).text(function(d) { return labels[d] + ' ('+ d + ')'; });
    },

    'analizo' : function(data) {
 	    new bubbleSVGChart({
	      'container' : 'chart',
	    	'size' : [300,200],
	    	'position' : [40,20],
	    	'strokeWidth' : 0,
	    	'lang' : 'en',
	    	'requestPath' : 'data',
        'requestData' : data,
		  	'useDefaultInterface' : true,
		  	'defaultBubbleSize' : 20,
		  	'initialState' : { 'x' : 'npm', 'y': 'loc', 'size' : 'noa', 'color' : '' },
  	  	'background' : ['#b9a680','#f0e4ca']
      });     
    }

  }

};

// Run our generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT }, function(tabs) {
    if (!localStorage.codeBrowserURL) {
      if (codeBrowserGenerator.valid(tabs[0].url)) {
        codeBrowserGenerator.changeIcon('blue');
        document.getElementById('url').innerHTML = tabs[0].url;
        document.getElementById('submit').onclick = function() {
          localStorage.codeBrowserURL = tabs[0].url;
          codeBrowserGenerator.requestData();
        }
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
