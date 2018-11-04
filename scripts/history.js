window.onload = loadLocalData;

function insertOriginData() {

  localStorage.setItem('buttonVal','Stop');
  var output = document.getElementById("HistoryTable");

  if (!navigator.geolocation) {
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }
  function success(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var date = new Date();
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>' + output.rows.length + '</td><td>' + date.toString() + '</td><td>' + latitude + '</td> <td>' + longitude + '</td><td> </td> <td> </td><td></td><td></td>';
    localStorage.setItem('startTime', date.getTime())
    output.appendChild(tr);
    document.getElementById("startButton").innerHTML="Stop";
     myVar = setInterval(myTimer, 1000);
    saveTableData();
    openNav();
  }
  navigator.geolocation.getCurrentPosition(success);
}

function saveTableData() {
  var table = document.getElementById("HistoryTable");
  var data = [];

  var headers = [];
  for (var i = 0; i < table.rows[0].cells.length; i++) {
    headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi, '');
  }
  headers[7]="totaltime";
  for (var i = 1; i < table.rows.length; i++) {
    var tableRow = table.rows[i];
    var rowData = {};

    for (var j = 0; j < tableRow.cells.length; j++) {
      rowData[headers[j]] = tableRow.cells[j].innerHTML;
    }
    data.push(rowData);
  }
  localStorage.setItem('data', JSON.stringify(data));
}

function timeElapsed() {
  var startTime = localStorage.getItem('startTime');
  var currentTime = new Date().getTime();
  var totalTime = ((currentTime - startTime) / 1000);
  return totalTime;
}

function insertDestData() {
  localStorage.setItem('buttonVal','Start');
  var table = document.getElementById("HistoryTable");

  function success(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var lastRow = table.rows[table.rows.length - 1];
    var stopTime = timeElapsed();
    lastRow.cells[4].innerHTML = new Date().toString();
    lastRow.cells[5].innerHTML = latitude;
    lastRow.cells[6].innerHTML = longitude;
    lastRow.cells[7].innerHTML = stopTime;
    document.getElementById("startButton").innerHTML="Start";
    clearInterval(myVar);
    saveTableData();
  }
  navigator.geolocation.getCurrentPosition(success);

}


function loadLocalData() {
  var buttonVal=localStorage.getItem('buttonVal');
  document.getElementById("startButton").innerHTML=buttonVal;
  var tableJSONString = localStorage.getItem('data');
  if (tableJSONString != undefined) {
    var tableJson = JSON.parse(tableJSONString);
    var output = document.getElementById("HistoryTable");
    for (var i = 0; i < tableJson.length; i++) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + tableJson[i].srno + '</td><td>' + tableJson[i].starttime + '</td><td>' + tableJson[i].originlongitude + '</td> <td>' + tableJson[i].originlattitude + '</td><td>' + tableJson[i].stoptime + ' </td> <td>' + tableJson[i].destinationlongitude + ' </td><td>' + tableJson[i].destinationlattitude + '</td><td>' + tableJson[i].totaltime + '</td>';
      output.appendChild(tr);
    }
if(buttonVal=="Stop") myVar=setInterval(myTimer,1000);
  }

}


function reset() {
  $('#HistoryTable tr:not(:first)').remove();
  localStorage.removeItem('data');
  clearInterval(myVar);
  document.getElementById("startButton").innerHTML="Start";
}

function startStopTime() {
  var elem = document.getElementById("startButton");
  if (elem.innerHTML == "Stop") {

    insertDestData();
  }
  else {

    insertOriginData();
  }
}

function timeInDays(seconds){
  var num = seconds;
  var days =(num / (60*60*24));
  var rdays=Math.floor(days);
  var hours=(days - rdays)*24;
  var rhours=Math.floor(hours);
  var minutes = (hours - rhours) * 60;
  var rMinutes = Math.floor(minutes);
  var seconds = (minutes - rMinutes) * 60;
  var rseconds = Math.round(seconds);
  return rdays +" day(s) and "+rhours +" hour(s) and "+rMinutes + " minute(s) and " + rseconds + " sec";

}


function openNav() {
  document.getElementById("myNav").style.width = "100%";
}

function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

var myVar ;

function myTimer() {
    document.getElementById("demo").innerHTML = timeInDays(timeElapsed());
}
