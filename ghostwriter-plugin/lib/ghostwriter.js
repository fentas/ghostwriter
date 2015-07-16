var extend = require('extend')


function ghostwriter(options) {
	if ( ! (this instanceof ghostwriter) )
		return new ghostwriter(options)

	this._options = {}
	this._set(options)
}
extend(ghostwriter.prototype, {
	_set: function(type) {
		var self = this,
				fs = require('fs')

		if ( typeof type == 'object' )
			extend(self._options, type)

		try { self._options.name && fs.lstatSync(self.project = self.projects()[self._options.name].path) } catch(e) {
			throw new Error('Missing folder of project. ['+self._options.name+']')
		}
		return self
	},
	config: function() {
		return require('home-config').load('.ghostwriter')
	},
	projects: function() {
		return require('home-config').load('.ghostwriter').projects
	},
	list: function() {
		var fs = require('fs'),
				path = require('path'),
				self = this,
				walk = function (currentDirPath, ressources) {
					fs.readdirSync(currentDirPath).forEach(function(name) {
						var ressource = {
									type: 'file',
									icon: 'file '+ path.extname(name).replace(/^\./, ''),
									text: name,
									path: path.join(currentDirPath, name),
									a_attr: {'data-path': path.join(currentDirPath, name).substring(self.project.length), 'data-type': 'file'}
								},
								stat = ressource.stat = fs.statSync(ressource.path);
						if (stat.isFile())
							ressources.push(ressource)
						else if (stat.isDirectory()) {
							ressource.type = ressource.icon = ressource.a_attr['data-type'] = 'directory'
							ressource.children = []
							ressources.push(ressource)

							walk(ressource.path, ressource.children);
						}
					})
				},
				ress = []
		walk(self.project, ress)
		return ress
	},
	file: function() {
		var fs = require('fs'),
				path = require('path'),
				self = this

		if ( self._options.read ) {
			return fs.readFileSync(path.join(self.project, self._options.file), {encoding: 'utf8'})
		}
	},
	docker: function(cb) {
		var c3docker = require('c3docker'),
				fs = require('fs'),
				path = require('path'),
				self = this,
				file, cmd

		if ( self._options.file ) {
			file = path.join('/data/', self._options.file)
		}
		else if ( self._options.source ) {

		}

		cmd = ['/ghostwriter/main.js', '--ghostwriter-exec=' + file]

		c3docker({'Volumes': {'/data': {}, '/ghostwriter':{}}, Cmd: cmd, 'Entrypoint': self._options.entrypoint, 'Image': self._options.image, 'Env': self._options.env}).then(function(container) {
		  cb(container)
			/*
		    .on('message', function(msg) {
		      if ( msg.stdin ) {
		        this.stdin = 'Hello World'
		      }
		      else if ( msg.stderr ) {
		        console.log('stderr', msg.toString('utf8'))
		      }
		      else {
		        console.log('stdout', msg.toString('utf8'))
		      }

		    })
			*/

		  container.start({Binds: [self.project+':/data', path.resolve(__dirname+'/../docker')+':/ghostwriter']}, function(err, exec) {
		    //console.log(exec)
		    //setTimeout(function() {
		    //  container.kill(function(err) {})
		    //}, 15000)
		  })
		}).done()

		return true;
	}
})

module.exports = exports = ghostwriter
