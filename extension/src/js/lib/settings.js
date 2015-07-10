
function Settings() {

	EventEmitter.call(this);

	var storageAPI = StorageApiBridge.instance;
	var self = this;
	var localCopy = {
		config: {},
		projects: {},
		
		colorTheme: 'monokai_bright'
	};

	this.load = function(){
		storageAPI.get(null, function(items) {
			localCopy = extend(localCopy, items || {});
			self.ready = true;
			self.emit('ready');
		});
	}

	this.get = function(a){
		return localCopy[a];
	}

	this.set = function(a,b){
		localCopy[a] = b;
		var data = {};
		data[a] = b;
		storageAPI.set(data, function(){});
	}

	this.updateProject = function (name, obj) {
		var projects = localCopy['projects'] || {};
		var project = projects[url] || {};
		extend(project, obj);
		projects[name] = project;
		this.set('projects', projects);
	}

}
inherits(Settings, EventEmitter);
// Settings = new Settings();
