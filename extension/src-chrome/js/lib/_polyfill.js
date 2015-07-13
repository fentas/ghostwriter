
try {
	var manifest = chrome.runtime.getManifest(),
    	extVersion = manifest.version;
} catch(e) {
  // opend in browser
  console.warn('BROWSER CALL')
  // $('#projects').html(tplProjectList({"test":{path: "foo"}}))

	if ( ! chrome ) chrome = {}

	chrome.runtime.getManifest = function() { return {version: '.browser'}}
	chrome.runtime.connect = function(port) {
		var _ = function() {}
		if ( port.name == "chrome.storage port" ) {
			return {
				postMessage: function(data) {
					var d = {
						'active-project': 'sample'
					}
					if ( data.method == 'get' )
						return _(extend({}, (data.keys == null ? d : d[data.keys]), {'message_id': data.message_id}))
					else {
						extend(d, data.keys)
					}
				},
				onMessage: {
					addListener: function(cb) {
						_ = cb
					}
				}
			}

		}
		else if ( port.name == "chrome.nativeMessaging port" ) {
			return {
				postMessage: function(msg) {
					switch ( msg.event ) {
						case 'config':
						case 'init':
							_({event: 'config', data: {"workspace":"/home/user/github/ghostwriter/ghostwriter-plugin/~/ghostwriter","projects":{"sample":{"path":"/home/user/github/ghostwriter/ghostwriter-plugin/sample"}},"__filename":".ghostwriter"}})
							break;
						case 'watch':
							_({event: 'watch', data: true})
						case 'list':
							var d = [{"type":"file","icon":"file js","text":"googlelinks.js","path":"/home/user/github/ghostwriter/ghostwriter-plugin/sample/googlelinks.js","a_attr":{"data-path":"/googlelinks.js","data-type":"file"},"stat":{"dev":36,"mode":33204,"nlink":1,"uid":1000,"gid":1000,"rdev":0,"blksize":4096,"ino":2911716,"size":951,"blocks":24,"atime":"2015-07-13T08:31:47.141Z","mtime":"2015-07-09T07:53:51.242Z","ctime":"2015-07-09T07:54:37.430Z","birthtime":"2015-07-09T07:54:37.430Z"}},{"type":"directory","icon":"directory","text":"test","path":"/home/user/github/ghostwriter/ghostwriter-plugin/sample/test","a_attr":{"data-path":"/test","data-type":"directory"},"stat":{"dev":36,"mode":16893,"nlink":2,"uid":1000,"gid":1000,"rdev":0,"blksize":4096,"ino":3006831,"size":4096,"blocks":8,"atime":"2015-07-13T08:31:47.141Z","mtime":"2015-07-09T07:54:19.474Z","ctime":"2015-07-09T07:54:19.474Z","birthtime":"2015-07-09T07:54:19.474Z"},"children":[{"type":"file","icon":"file js","text":"googletesting.js","path":"/home/user/github/ghostwriter/ghostwriter-plugin/sample/test/googletesting.js","a_attr":{"data-path":"/test/googletesting.js","data-type":"file"},"stat":{"dev":36,"mode":33204,"nlink":1,"uid":1000,"gid":1000,"rdev":0,"blksize":4096,"ino":2911718,"size":826,"blocks":24,"atime":"2015-07-13T08:31:47.141Z","mtime":"2015-07-09T07:54:26.042Z","ctime":"2015-07-09T07:54:26.042Z","birthtime":"2015-07-09T07:54:26.042Z"}}]}]
							_({event: 'list', data: d})
							break;
						case 'file':
							_({event: 'file', data: "var links = [];\nvar casper = require('casper').create();\n\nfunction getLinks() {\n    var links = document.querySelectorAll('h3.r a');\n    return Array.prototype.map.call(links, function(e) {\n        return e.getAttribute('href');\n    });\n}\n\ncasper.start('http://google.fr/', function() {\n    // search for 'casperjs' from google form\n    this.fill('form[action=\"/search\"]', { q: 'casperjs' }, true);\n});\n\ncasper.then(function() {\n    // aggregate results for the 'casperjs' search\n    links = this.evaluate(getLinks);\n    // now search for 'phantomjs' by filling the form again\n    this.fill('form[action=\"/search\"]', { q: 'phantomjs' }, true);\n});\n\ncasper.then(function() {\n    // aggregate results for the 'phantomjs' search\n    links = links.concat(this.evaluate(getLinks));\n});\n\ncasper.run(function() {\n    // echo results in some pretty fashion\n    this.echo(links.length + ' links found:');\n    this.echo(' - ' + links.join('\\n - ')).exit();\n});\n"})
						default:

					}
				},
				onMessage: {
					addListener: function(cb) {
						_ = cb
					}
				},
				onDisconnect: new EventEmitter
			}
		}
	}
}
