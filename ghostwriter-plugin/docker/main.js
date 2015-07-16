var system = require('system'),
		args = system.args,
		execute = null

args.forEach(function(arg, i) {
  console.log(i + ': ' + arg);
	if ( /^--ghostwriter-exec=(.*)$/.test(arg) ) {
		execute = RegExp.$1
		return false;
	}
})

if ( execute )
	require(execute)
else
	system.stderr.writeLine('Can not find --ghostwriter-exec')
