'use strict';
// Extension version, comes from runtime
//var manifest = chrome.runtime.getManifest(),
//    extVersion = manifest.version;
//document.getElementById('toolsVersion').innerHTML = 'v' + manifest.version;


$('#panel').html(JST['extension/src/templates/panel-tpl.html']).layout({
  closable: true,
  resizable: true,
  slidable: true, //???
  livePaneResizing: true //???
})

$('#tasks, #output, #debug').tabs({})
