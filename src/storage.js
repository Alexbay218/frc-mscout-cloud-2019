var storage = firebase.storage();
var database = firebase.database();

var refList = [];
var zipList = [];
var zipLength = 0;

var upload = function(list, fileList) {
  var storageRef = storage.ref();
  var databaseRef = database.ref();
  refList = [];

  for(var i = 0;i < list.length;i++) {
    var newStr = list[i].slice();
    var metadata = newStr.substr(0,newStr.indexOf(":"));
    var sourceTeam = metadata.substr(0,metadata.indexOf(";"));
    metadata = metadata.substr(metadata.indexOf(";")+1);
    var targetTeam = metadata.substr(0,metadata.indexOf(";"));
    metadata = metadata.substr(metadata.indexOf(";")+1);
    var timeStamp = metadata.substr(0,metadata.indexOf(";"));
    metadata = metadata.substr(metadata.indexOf(";")+1);
    if(1546682400000 < Number.parseInt(timeStamp)) {
      var matchType = metadata.substr(0,metadata.indexOf(";"));
      metadata = metadata.substr(metadata.indexOf(";")+1);
      var matchNumber = metadata.substr(0,metadata.indexOf(";"));
      metadata = metadata.substr(metadata.indexOf(";")+1);
      refList.push(storageRef.child("data/" + targetTeam + "/" + matchType + matchNumber + "_" + sourceTeam + "_" + timeStamp + ".fmt").put(fileList[i]));
      databaseRef.child("data").push({
        sT: sourceTeam,
        tT: targetTeam,
        tS: timeStamp,
        mT: matchType,
        mN: matchNumber
      });
    }
  }
};

var download = function() {
  var storageRef = storage.ref();
  var databaseRef = database.ref();
  zipList = [];
  zipLength = 0;

  databaseRef.child("data").once("value").then((sp) => {
    var path = [];
    for(var property in sp.val()) {
      var currObj = sp.val()[property];
      path.push("data/" + currObj.tT + "/" + currObj.mT + currObj.mN + "_" + currObj.sT + "_" + currObj.tS + ".fmt");
    }
    console.log(path);
    zipLength = path.length;
    for(var i = 0;i < path.length;i++) {
      storageRef.child(path[i]).getDownloadURL().then((url) => {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
          zipList.push(xhr.response);
          if(zipList.length == zipLength) {
            downloadFiles(zipList);
          }
        };
        xhr.open('GET', url);
        xhr.send();
      });
    }
  });
};

var downloadFiles = function(zipList) {
  var zipObj = new JSZip();
  var fileR = new FileReader();
  var fileList = [];
  var currIt = 0;

  fileR.onload = () => {
    fileList.push(fileR.result);
    if(fileList.length == zipList.length) {
      for(var i = 0;i < fileList.length;i++) {
        var currFile = fileList[i];
        var newFolder = zipObj.folder("data").folder(stringToFolder(currFile));
        newFolder.file(stringToFileName(currFile),currFile);
      }
      zipObj.generateAsync({type:"blob"}).then(function(content) {
        console.log(content);
        saveAs(content, "data.zip");
      });
    }
    else {
      currIt++;
      fileR.readAsText(zipList[currIt]);
    }
  };
  if(zipList.length > 0) {
    fileR.readAsText(zipList[0]);
  }
};

var stringToFolder = function(str) {
  var newStr = str.slice();
  var metadata = newStr.substr(0,newStr.indexOf(":"));
  var sourceTeam = metadata.substr(0,metadata.indexOf(";"));
  metadata = metadata.substr(metadata.indexOf(";")+1);
  var targetTeam = metadata.substr(0,metadata.indexOf(";"));
  metadata = metadata.substr(metadata.indexOf(";")+1);
  var timeStamp = metadata.substr(0,metadata.indexOf(";"));
  metadata = metadata.substr(metadata.indexOf(";")+1);
  var matchType = metadata.substr(0,metadata.indexOf(";"));
  metadata = metadata.substr(metadata.indexOf(";")+1);
  var matchNumber = metadata.substr(0,metadata.indexOf(";"));
  metadata = metadata.substr(metadata.indexOf(";")+1);
  return targetTeam;
}

var stringToFileName = function(str) {
  var newStr = str.slice();
  var metadata = newStr.substr(0,newStr.indexOf(":"));
  var sourceTeam = metadata.substr(0,metadata.indexOf(";"));
  metadata = metadata.substr(metadata.indexOf(";")+1);
  var targetTeam = metadata.substr(0,metadata.indexOf(";"));
  metadata = metadata.substr(metadata.indexOf(";")+1);
  var timeStamp = metadata.substr(0,metadata.indexOf(";"));
  metadata = metadata.substr(metadata.indexOf(";")+1);
  var matchType = metadata.substr(0,metadata.indexOf(";"));
  metadata = metadata.substr(metadata.indexOf(";")+1);
  var matchNumber = metadata.substr(0,metadata.indexOf(";"));
  metadata = metadata.substr(metadata.indexOf(";")+1);
  return matchType + matchNumber + "_" + sourceTeam + "_" + timeStamp + ".fmt";
}
