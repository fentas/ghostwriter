var extend = require('extend')


function ghostwriter(options) {
	if ( ! (this instanceof ghostwriter) )
		return new ghostwriter(options)

	this._options = extend(options, {

	})
}
extend(ghostwriter.prototype, {
	config: function() {

		return require('home-config').load('.ghostwriter')
	},
	projects: function() {
		return require('home-config').load('.ghostwriter').projects
	},
	list: function(proot) {
		var fs = require('fs'),
				path = require('path'),
				walk = function (currentDirPath, ressources) {
					fs.readdirSync(currentDirPath).forEach(function(name) {
						var ressource = {
									type: 'file',
									name: name,
									path: path.join(currentDirPath, name)
								},
								stat = ressource.stat = fs.statSync(ressource.path);
						if (stat.isFile())
							ressources.push(ressource)
						else if (stat.isDirectory()) {
							ressource.type = 'directory'
							ressource.files = []
							ressources.push(ressource)

							walk(ressource.path, ressource.files);
						}
					})
				},
				ress = []
		walk(proot, ress)
		return ress
	}
})

module.exports = exports = ghostwriter
