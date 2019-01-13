var graphRawData = [];
var graphData = {
  x: [],
  y: [],
  mode: "lines+markers",
  name: "Scatter and Lines"
};
var hasQueried = false;

var query = (callback) => {
  database.ref().child("data").once("value").then((sp) => {
    graphRawData = [];
    for(var property in sp.val()) {
      graphRawData.push(sp.val()[property]);
    }
    hasQueried = true;
    callback();
  });
};

var listen = () => {
  database.ref().child("data").on("child_added", (sp) => {
    graphRawData.push(sp.val());
    graph();
  });
  graph();
};

var graph = () => {
  var layout = {
    yaxis: {
      title: "Matches Scouted"
    }
  };
  var intervalNum = 20;
  var interval = Number.parseInt(document.getElementById("plotOption").value)/intervalNum;
  console.log(interval*intervalNum);
  var currDate = Date.now();
  graphData.x = [];
  graphData.y = [];
  for(var i = 0;i < intervalNum;i++) {
    var startDate = currDate - interval * (intervalNum - i);
    graphData.x.push((new Date(startDate)).toLocaleString());
    var endDate = currDate - interval * ((intervalNum - i) - 1);
    var sum = 0;
    for(var j = 0;j < graphRawData.length;j++) {
      if(startDate <= Number.parseInt(graphRawData[j].tS) && endDate >= Number.parseInt(graphRawData[j].tS)) {
        sum++;
      }
    }
    graphData.y.push(sum);
  }

  Plotly.newPlot("plot", [graphData], layout);
};

query(listen);
