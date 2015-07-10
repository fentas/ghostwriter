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
		tplProjectList = JST['extension/src/templates/projects.html'],
		tplSources = JST['extension/src/templates/sources.html']


$('#panel').html(tplPanel({})).layout({
  closable: true,
  resizable: true,
  slidable: true, //???
  livePaneResizing: true //???
})

$('#tasks, #output, #debug').tabs({})

var socket = new NativeMessagingBridge(),
		settings = new Settings(),
    project = null

// can't connect to native messaging host
socket.on('nm-error', function(msg) {

})
// will be called with first host message...
socket.on('connect', function() {})
socket.on('disconnect', function() {
  //console.send('disconnect devtools')

})
socket.on('watch', function(success) {
  if ( ! success )
    console.log('TODO: show error...')
})
socket.on('list', function(list) {
  if ( ! project )
    throw new Error('Somthing went wrong...')

  $.jstree.defaults.core.data = settings.updateProject(project, {"list": list}).list//[project, settings.updateProject(project, {"list": list}).list]

  $('#sources').jstree({
    "plugins" : [ "wholerow", "contextmenu", "dnd", "search", "sort", "unique" ]
  })
})

// init call from native messaging host
socket.on('config', function(config) {
	settings.set('config', config)
  if ( settings.get('active-project') ) {
    if ( ! project )
      socket.emit('watch', (project = settings.get('active-project')))

    $('#notice').removeAttr('class')
  }
  else {
    var $notice = $('#notice').removeClass('loading').addClass('projects')
  	$('#projects').html(
      $(tplProjectList(config.projects)).find('a').bind('click', function() {
        $notice.removeAttr('class')
        if ( project )
          socket.emit('unwatch', project)
        project = $(this).attr('data-name')

        settings.set('active-project', project)
        socket.emit('watch', project)
      }).end()
    )
  }
})

settings.on('ready', function() {
  socket.connect();
})
settings.load()
