/**
 | @name: logError
 | @desc: log javscript errors on the database
 */

function logError(details) {
  let url = 'http://github.com/pihh';
  let data = JSON.stringify({browser: navigator.userAgent, details: details});
  let xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open("POST", url);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(data);

}
