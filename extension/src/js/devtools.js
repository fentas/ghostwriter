'use strict';
// Extension version, comes from runtime
try {
var manifest = chrome.runtime.getManifest(),
    extVersion = manifest.version;
document.getElementById('toolsVersion').innerHTML = 'v' + manifest.version;
} catch(e) {
  // opend in browser

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
  /*
  east: {
    minSize: 250
  },
  west: {
    minSize: 200
  },
  */
  south: {
    minSize: 24,
    closable: false
  }
})

var $tabs = $('#tasks, #output, #debug').tabs({})
.eq(1)
.on("tabsactivate", function(event, ui) {
  setTimeout(function() {
    if ( $(ui.newPanel[0]).attr('data-test') == '1' ) {
      $('#debug-action').attr('class', 'status-bar-item focus-status-bar-item')
    }
    else {
      $('#debug-action').attr('class', 'status-bar-item play-status-bar-item')
    }
  }, 250)
})
.find( ".ui-tabs-nav" ).sortable({
  axis: "x",
  stop: function() {
    $tabs.eq(1).tabs( "refresh" );
  }
})


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
    $('#debug-action').removeAttr('disabled')

    // open editor TODO: remove
    setTimeout(function() {
      //TODO: better check?
      var test = /casper\.test\.begin/g.test(data)?1:0,
          div = $('#output').find('div.loading').removeClass('loading').attr('data-test', test),
          editor = ace.edit(div.find('p')[0]) //ace editor

      editor.setValue(data)
      editor.gotoLine(1)
      editor.setTheme("ace/theme/chrome");
      editor.getSession().setMode("ace/mode/javascript")
      editor.session.setUseSoftTabs(true)
      editor.session.setTabSize(2)
      editor.setShowPrintMargin(false)
      editor.setOptions({
        //maxLines: Infinity
      })
    }, 0)
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


var terminal = $('#status > ul.terminal')

socket.on('docker.stdout', function(message) {
  $('<li>'+ansi_up.ansi_to_html(message)+'</li>').appendTo(terminal)
  terminal.scrollTop(terminal[0].scrollHeight)
})


/**
* actions
**/
$('#debug-action').bind('click', function(event) {
  var file = $('#output > .ui-tabs-nav > .ui-tabs-active > a').attr['data-path'],
      options = {
        'name': project,
        'file': file,
        'test': ! $(this).hasClass('play-status-bar-item')
      }
  $('<li class="command">docker [blahblubb] fentas/phantomjs '+file+'</li>').appendTo(terminal)

  socket.emit('docker.start', options)
})


$('#panel #back-projects').bind('click', function() {
  $('#notice').addClass('projects')
})

$('#debug-action > *').longclick(function() {
  var self = $(this).parent(),
      b = $('<div class="button-toolbox"><button class="status-bar-item play-status-bar-item emulate-active" title="Run script"><i class="glyph"></i></button><button class="status-bar-item focus-status-bar-item" title="Run capserjs test"><i class="glyph"></i></button></div>')
  .css(extend($(this).offset())).appendTo(document.body)
  .find('button').bind('mouseup', function() {
    self.attr('class', $(this).attr('class').replace(/\s*emulate-active\s*/, ''))
  }).bind('mouseover', function() {
    $(this).addClass('emulate-active')
  }).bind('mouseout', function() {
    $(this).removeClass('emulate-active')
  }).end()
  $(document).mouseup(function() { b.remove(); })
})
