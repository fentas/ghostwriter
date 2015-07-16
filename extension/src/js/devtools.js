'use strict';
// Extension version, comes from runtime
try {
var manifest = chrome.runtime.getManifest(),
    extVersion = manifest.version;
document.getElementById('toolsVersion').innerHTML = 'v' + manifest.version;
} catch(e) {
  // opend in browser

}

console.send = function(obj) {
	if(chrome && chrome.runtime) {
		chrome.runtime.sendMessage({type: "console", obj: obj});
	}
}

$.jstree.defaults.sort = function(node1, node2) {
  var node1 = this._model.data[node1],
      node2 = this._model.data[node2]

  if ( node1.a_attr['data-type'] == node2.a_attr['data-type'] ) {
    return node1.text.localeCompare( node2.text )
  }
  else {
    if ( node1.a_attr['data-type'] == 'file' )
      return 1
    return -1
  }

}

var tplPanel = JST['extension/src/templates/panel-tpl.html'],
		tplProjectList = JST['extension/src/templates/projects.html'],
		tplSources = JST['extension/src/templates/sources.html']


$('#panel').html(tplPanel({})).layout({
  closable: true,
  resizable: true,
  slidable: true, //???
  livePaneResizing: true, //???
  east: {
    minSize: 250
  },
  west: {
    minSize: 200
  },
  south: {
    minSize: 24
  }
})
$('#panel #back-projects').bind('click', function() {
  $('#notice').addClass('projects')
})

var $tabs = $('#tasks, #output, #debug').tabs({})
.eq(1).find( ".ui-tabs-nav" ).sortable({
  axis: "x",
  stop: function() {
    $tabs.eq(1).tabs( "refresh" );
  }
});

$('#debug > div > div').accordion({
  animate: false,
  collapsible: true,
  heightStyle: "content",
  header: 'h3',
  active: false
})


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

  $('#sources')
  .on('select_node.jstree', function(event, data) {
    if ( data.node.a_attr['data-type'] == 'file' ) {
      var li =  $('#output .ui-tabs-nav li a[href="#'+data.node.a_attr['data-path']+'"]').parent()
      if ( ! li.length ) {
        socket.emit('file', {'name': project, 'file': data.node.a_attr['data-path'], 'read': true})

        //TODO: where this come from?
        delete data.node.a_attr.href
        $('#output').find( ".ui-tabs-nav" )
        .append( '<li><a href="#'+data.node.a_attr['data-path']+'">'+data.node.text+'</a> <span class="ui-icon ui-icon-close" role="presentation">Remove Tab</span></li>' )
        .find('a').attr(data.node.a_attr).end().end()
        .append( '<div id="'+data.node.a_attr['data-path']+'" class="loading"><p></p></div>' )
        .tabs( "refresh" ).tabs( "option", "active", $('#output .ui-tabs-nav li:last').index()-1 )
      }
      else {
        $('#output').tabs( "option", "active", li.index()-1 )
      }
    }
  })
  .jstree({
    "plugins" : [ "wholerow", "contextmenu", "dnd", "search", "sort", "unique" ]
  })
})
socket.on('file', function (data) {

  if ( typeof data == 'boolean' ) {

  }
  else {
    // open editor TODO: remove
    setTimeout(function() {
      var editor = ace.edit($('#output').find('div.loading').removeClass('loading').find('p')[0]) //ace editor
      editor.setValue(data)
      editor.gotoLine(1)
      editor.setTheme("ace/theme/chrome");
      editor.getSession().setMode("ace/mode/javascript")
      editor.session.setUseSoftTabs(true)
      editor.session.setTabSize(2)
      editor.setShowPrintMargin(false)
    }, 10)
  }
})

// init call from native messaging host
socket.on('config', function(config) {
  var $notice = $('#notice')

	settings.set('config', config)
  if ( settings.get('active-project') ) {
    if ( ! project )
      socket.emit('watch', (project = settings.get('active-project')))

    $notice.removeAttr('class')
  }
  else {
    $notice.removeClass('loading').addClass('projects')
  }
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

})

settings.on('ready', function() {
  socket.connect();
})
settings.load()
