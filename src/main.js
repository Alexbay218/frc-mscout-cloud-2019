var folder = document.getElementById("selectFile");
var files, fileR, list, fileList, loadingFunct, currIt, doneFunct, contentCheck;

folder.onchange = () => {
  files = folder.files;
  fileR = new FileReader();
  list = [];
  fileList = [];
  currIt = 0;
  fileR.onload = () => {
    if(contentCheck(fileR.result)) {
      list.push(fileR.result);
      fileList.push(files[currIt]);
    }
    currIt++;
    if(currIt < files.length) {
      loadingFunct();
    }
    else {
      doneFunct();
    }
  };
  loadingFunct = () => {
    if(files[currIt].name.lastIndexOf(".") != -1 && files[currIt].name.substr(files[currIt].name.lastIndexOf(".")) == ".fmt") {
      fileR.readAsText(files[currIt]);
    }
  }
  loadingFunct();
};

doneFunct = () => {
  upload(list, fileList);
}

var contentCheck = function(str) {
  var numFunct = function(str, comp) {
    var i = 0;
    var sum = 0;
    while(str.indexOf(comp,i) != -1 && i < str.length) {
      i = str.indexOf(comp,i) + 1;
      sum++;
    }
    return sum;
  }
  var newStr = str.slice();
  var metadata = newStr.substr(0,newStr.indexOf(":"));
  if(newStr.indexOf(":") + 1 > newStr.length) {
    return false;
  }
  newStr = newStr.substr(newStr.indexOf(":") + 1);
  var vardata = newStr.substr(0,newStr.indexOf(":"));
  if(newStr.indexOf(":") + 1 > newStr.length) {
    return false;
  }
  newStr = newStr.substr(newStr.indexOf(":") + 1);
  var data = newStr;

  return (numFunct(metadata,";") == 5 && numFunct(vardata,";") == 2 && numFunct(data,",") == numFunct(data,";"));
}
