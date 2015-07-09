'use strict';
// Extension version, comes from runtime
//var manifest = chrome.runtime.getManifest(),
//    extVersion = manifest.version;
//document.getElementById('toolsVersion').innerHTML = 'v' + manifest.version;


console.send = function(obj) {
	if(chrome && chrome.runtime) {
		chrome.runtime.sendMessage({type: "console", obj: obj});
	}
}


$('#panel').html(JST['extension/src/templates/panel-tpl.html']).layout({
  closable: true,
  resizable: true,
  slidable: true, //???
  livePaneResizing: true //???
})

$('#tasks, #output, #debug').tabs({})

socket = new NativeMessagingBridge();
socket.on('nm-error', function(msg) {

})
socket.on('connect', function() {
  console.send('connected')
})
socket.on('disconnect', function() {

})
socket.on('data', function(data) {

})
socket.connect();
