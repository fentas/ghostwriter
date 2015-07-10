'use strict';
// Extension version, comes from runtime
try {
var manifest = chrome.runtime.getManifest(),
    extVersion = manifest.version;
document.getElementById('toolsVersion').innerHTML = 'v' + manifest.version;
} catch(e) {
  // opend in browser
  $('#projects').html(tplProjectList({"test":{path: "foo"}}))

}

console.send = function(obj) {
	if(chrome && chrome.runtime) {
		chrome.runtime.sendMessage({type: "console", obj: obj});
	}
}

var tplPanel = JST['extension/src/templates/panel-tpl.html'],
		tplProjectList = JST['extension/src/templates/projects.html']


$('#panel').html(tplPanel({})).layout({
  closable: true,
  resizable: true,
  slidable: true, //???
  livePaneResizing: true //???
})

$('#tasks, #output, #debug').tabs({})

var socket = new NativeMessagingBridge(),
		settings = new Settings()

// can't connect to native messaging host
socket.on('nm-error', function(msg) {

})
// will be called with first host message...
socket.on('connect', function() {})
socket.on('disconnect', function() {
  //console.send('disconnect devtools')

})
socket.on('list', function(list) {
  
})

// init call from native messaging host
socket.on('config', function(config) {
	settings.set('config', config)

  var $notice = $('#notice').removeClass('loading').addClass('projects')
	$('#projects').html(
    $(tplProjectList(config.projects)).find('a').bind('click', function() {
      $notice.removeAttr('class')

      //TODO: unwatch current project if exists
      socket.emit('watch', $(this).attr('data-name'))
    }).end()
  )
})
socket.connect();
