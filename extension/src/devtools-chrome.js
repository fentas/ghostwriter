/**
* Debuging utility
**/

console.send = function(obj) {
	if(chrome && chrome.runtime) {
		chrome.runtime.sendMessage({type: "console", obj: obj});
	}
}

/**
* Create Ghostwriter main panel
**/
chrome.devtools.panels.create(
  "Ghostwriter",
  "img/icon-dev.png",
  "panel.html"
)

/**
* Add sidebar to Element panel
**/
/*
chrome.devtools.panels.elements.createSidebarPane("Ghostwriter",
  function(sidebar) {
    sidebar.setPage("sidebar.html")
    sidebar.createStatusBarButton('img/icon-dev.png', 'test', false)
  }
)

chrome.devtools.panels.sources.createSidebarPane("Ghostwriter",
  function(sidebar) {
    chrome.devtools.inspectedWindow.getResources(function callback(resources) {
      //bglog(resources)
    })
    chrome.devtools.inspectedWindow.onResourceContentCommitted.addListener(function callback(resource, content) {
      bglog(resource)
      bglog(content)
    })
    //alert('test')
    //console.log(sidebar, chrome.devtools.panels.sources)
    return
    sidebar.setObject(chrome.devtools.panels.sources)

    chrome.devtools.panels.sources.onSelectionChanged.addListener(function(resource, content) {
      bglog('test')
    })
  }
)

chrome.devtools.panels.sources.onSelectionChanged.addListener(function(resource, content) {
  bglog('test')
})
*/
