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
	}
})

module.exports = exports = ghostwriter
