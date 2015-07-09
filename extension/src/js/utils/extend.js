
/**
 * extend
 */

function extend(obj) {
	for(var i = 1; i < arguments.length; i++) {
		var source = arguments[i];
		if (source) {
			for (var prop in source) {
				obj[prop] = source[prop];
			}
		}
	}
	return obj;
}
